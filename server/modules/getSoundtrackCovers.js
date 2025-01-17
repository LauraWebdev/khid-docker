const axios = require('axios');
const cheerio = require('cheerio');
const {getAlbumUrl} = require("./getAlbumUrl");

const REQUEST_TIMEOUT = process.env.REQUEST_TIMEOUT || 30000;

async function getSoundtrackCovers(urlOrSlug) {
    console.log(`[GetSoundtrackCovers] ${urlOrSlug}`);
    const albumUrl = getAlbumUrl(urlOrSlug);

    try {
        // Fetch the album webpage
        const response = await axios.get(albumUrl, {
            timeout: REQUEST_TIMEOUT,
        });
        const html = response.data;
        const $ = cheerio.load(html);

        // Check if the soundtrack page exists
        const pageTitle = $("head > title").text();
        if (pageTitle === "Error") {
            console.log("[GetSoundtrackCovers] Soundtrack does not exist!");
            return null;
        }

        let imageUrls = [];
        let allImages = $("#pageContent .albumImage").find("a");
        allImages.each((_, image) => {
            let href = $(image).attr("href");
            let src = $(image).find("img").attr("src");
            imageUrls.push({
                thumbnail: src,
                full: href
            });
        });

        return imageUrls;
    } catch (error) {
        console.error(`[GetSoundtrackCovers] Error: ${error.message}`);
        return null;
    }
}

module.exports = { getSoundtrackCovers };