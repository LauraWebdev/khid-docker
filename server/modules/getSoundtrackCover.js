const axios = require('axios');
const cheerio = require('cheerio');

const REQUEST_TIMEOUT = process.env.REQUEST_TIMEOUT || 30000;

async function getSoundtrackCover(urlOrSlug) {
    console.log(`[GetSoundtrackCover] ${urlOrSlug}`);

    // Build the album URL
    const albumUrl = urlOrSlug.startsWith("https://downloads.khinsider.com")
        ? urlOrSlug
        : `https://downloads.khinsider.com/game-soundtracks/album/${urlOrSlug}`;

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
            console.log("[GetSoundtrackCover] Soundtrack does not exist!");
            return null;
        }

        let imageBase64 = null;
        let allImages = $("#pageContent .albumImage").find("a img");
        imageBase64 = allImages.first().attr("src");

        allImages.each((_, image) => {
            let href = $(image).attr("src");

            if(href.toLowerCase().includes("front")) {
                imageBase64 = href;
            }
            if(href.toLowerCase().includes("cover")) {
                imageBase64 = href;
            }
        });

        if(imageBase64 === null) {
            console.log(`[GetSoundtrackCover] No Cover Found`);
            return null;
        }

        // TODO Download and convert to base64

        return imageBase64;
    } catch (error) {
        console.error(`[GetSoundtrackCover] Error: ${error.message}`);
        return null;
    }
}

module.exports = { getSoundtrackCover };