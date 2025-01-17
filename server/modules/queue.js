const fs = require("node:fs");
const path = require("node:path");
const axios = require("axios");
const cheerio = require("cheerio");
const sanitizeFilename = require("./sanitizeFilename");
const { loadMusicMetadata } = require('music-metadata');
const ffmpegPath = require('ffmpeg-static');
const ffmetadata = require("ffmetadata");

const OUTPUT_DIR = process.env.OUTPUT_DIR || path.join(process.cwd(), '..');
const REQUEST_TIMEOUT = process.env.REQUEST_TIMEOUT || 30000;

class DownloadQueue {
    queue = [];
    isRunning = false;

    async run() {
        console.log("[DownloadQueue] Run queue");
        if (this.isRunning) {
            return;
        }

        this.isRunning = true;

        while (this.queue.filter((item) => item.state === 'queued').length > 0) {
            const currentItem = this.queue.find((item) => item.state === 'queued');
            currentItem.state = 'downloading';
            console.log(`[DownloadQueue] Downloading: ${currentItem.album} - ${currentItem.title}`);

            let soundtrackDir = path.join(OUTPUT_DIR, currentItem.slug);
            if(!fs.existsSync(OUTPUT_DIR)) {
                console.error(`[DownloadQueue] Output directory does not exist: ${OUTPUT_DIR}`);
                currentItem.state = 'failed';
                continue;
            }

            let response = await axios.get(currentItem.url, {
                timeout: REQUEST_TIMEOUT
            });
            let html = response.data;
            let $ = cheerio.load(html);

            let downloadLink = null;
            let allLinks = $("#pageContent").find("a");
            allLinks.each((_, element) => {
                let link = $(element).attr('href');
                if(link !== undefined && link !== null && link.endsWith(currentItem.format)) {
                    downloadLink = link;
                }
            });

            if(downloadLink === null) {
                console.error(`[DownloadQueue] Download link not found for ${currentItem.album} - ${currentItem.title}`);
                currentItem.state = 'failed';
                continue;
            }

            try {
                let downloadPath = path.join(soundtrackDir, `${sanitizeFilename(currentItem.title)}.${currentItem.format}`);
                let downloadResponse = await axios({
                    method: 'get',
                    url: downloadLink,
                    responseType: 'stream',
                    timeout: REQUEST_TIMEOUT,
                });

                let totalLength = downloadResponse.headers['content-length'];
                let downloadedLength = 0;
                let percentCompleted = 0;
                downloadResponse.data.on('data', (chunk) => {
                    downloadedLength += chunk.length;
                    percentCompleted = (downloadedLength / totalLength) * 100;
                    currentItem.progress = percentCompleted;
                });

                const downloadPromise = new Promise((resolve, reject) => {
                    downloadResponse.data.pipe(fs.createWriteStream(downloadPath))
                        .on('finish', resolve)
                        .on('error', reject);
                });
                await downloadPromise;

                if(currentItem.overrideArtist || currentItem.overrideGenre) {
                    let newMetadata = {};
                    if(currentItem.overrideArtist) {
                        newMetadata.artist = currentItem.overrideArtist;
                    }
                    if(currentItem.overrideAlbum) {
                        newMetadata.album = currentItem.overrideAlbum;
                    }
                    if(currentItem.overrideGenre) {
                        newMetadata.genre = currentItem.overrideGenre;
                    }

                    ffmetadata.setFfmpegPath(ffmpegPath);
                    const metadataPromise = new Promise((resolve, reject) => {
                        ffmetadata.write(downloadPath, newMetadata, function(err, data) {
                            if (err) {
                                reject(err);
                            }
                            resolve();
                        });
                    })

                    await metadataPromise;
                }

                currentItem.state = 'done';
            } catch(err) {
                currentItem.state = 'failed';
                console.error(`[DownloadQueue] Error downloading: ${currentItem.album} - ${currentItem.title}`);
                console.error(err);
            }
        }

        this.isRunning = false;
        console.log("[DownloadQueue] Queue finished");
    }

    getQueued() {
        return this.queue.filter((item) => item.state === 'queued');
    }

    getDownloading() {
        return this.queue.filter((item) => item.state === 'downloading');
    }

    getFailed() {
        return this.queue.filter((item) => item.state === 'failed');
    }

    getDone() {
        return this.queue.filter((item) => item.state === 'done');
    }

    addToQueue(newItem) {
        let soundtrackDir = path.join(OUTPUT_DIR, newItem.slug);
        if(!fs.existsSync(soundtrackDir)) {
            try {
                fs.mkdirSync(soundtrackDir);
                console.log("[DownloadQueue] Created soundtrack folder");
            } catch (err) {
                console.error(`[DownloadQueue] Couldn't create soundtrack folder`);
                console.error(err);
            }
        }

        const coverFilePathJpg = path.join(soundtrackDir, "cover.jpg");
        const coverFilePathPng = path.join(soundtrackDir, "cover.png");
        if (!fs.existsSync(coverFilePathJpg) && !fs.existsSync(coverFilePathPng)) {
            const coverOverride = newItem.overrides.cover;

            if (coverOverride && typeof coverOverride === "string") {
                if (coverOverride.startsWith("http")) {
                    const extension = coverOverride.endsWith(".png") ? "png" : "jpg";
                    const coverFilePath = path.join(soundtrackDir, `cover.${extension}`);
                    axios
                        .get(coverOverride, { responseType: "stream" })
                        .then((response) => {
                            const writer = fs.createWriteStream(coverFilePath);
                            response.data.pipe(writer);
                            writer.on("finish", () => {
                                console.log("[DownloadQueue] Cover image downloaded successfully");
                            });
                            writer.on("error", (err) => {
                                console.error("[DownloadQueue] Error saving cover image:", err);
                            });
                        })
                        .catch((err) => {
                            console.error("[DownloadQueue] Failed to download cover image:", err);
                        });
                } else if (coverOverride.startsWith("data:image")) {
                    const base64Data = coverOverride.split(",")[1];
                    const fileExtension = coverOverride.startsWith("data:image/png") ? "png" : "jpg";
                    const coverFilePath = path.join(soundtrackDir, `cover.${fileExtension}`);
                    try {
                        fs.writeFileSync(coverFilePath, base64Data, { encoding: "base64" });
                        console.log("[DownloadQueue] Cover image saved successfully from Base64 data");
                    } catch (err) {
                        console.error("[DownloadQueue] Error saving Base64 cover image:", err);
                    }
                } else {
                    console.warn("[DownloadQueue] Cover override is neither a valid URL nor Base64.");
                }
            }
        }

        newItem.songs.forEach(song => {
            let queueItem = {
                album: newItem.title,
                slug: newItem.slug,
                format: newItem.format,
                url: song.url,
                title: song.title,
                overrideArtist: newItem.overrides.artist,
                overrideGenre: newItem.overrides.genre,
                overrideAlbum: newItem.overrides.album,
                state: "queued",
                progress: 0,
            };

            this.queue.push(queueItem);
        });
    }

    clearDone() {
        this.queue = this.queue.filter((item) => item.state !== 'done');
    }

    retryFailed() {
        this.queue.filter((item) => item.state === 'failed').forEach((item) => {
            item.state = 'queued';
        });
    }
}

module.exports = DownloadQueue;