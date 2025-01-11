const axios = require('axios');
const cheerio = require('cheerio');

const REQUEST_TIMEOUT = process.env.REQUEST_TIMEOUT || 30000;

async function getSoundtrackMeta(urlOrSlug) {
    console.log(`[GetSoundtrackMeta] ${urlOrSlug}`);

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
            console.log("[GetSoundtrackMeta] Soundtrack does not exist!");
            return null;
        }

        // Retrieve the album title
        const albumTitle = $("#pageContent > h2").first().text().trim();
        console.log(`[GetSoundtrackMeta] Soundtrack Name: ${albumTitle}`);

        // Initialize the soundtrack object
        const soundtrack = {
            url: albumUrl,
            title: albumTitle,
            slug: albumUrl.replace("https://downloads.khinsider.com/game-soundtracks/album/", ""),
            formats: [],
            songs: []
        };

        // File Formats
        let hasCdHeader = false;
        let hasNumberHeader = false;

        const songListHeaderItems = $("#songlist_header > th");
        songListHeaderItems.each((_, item) => {
            const headerText = $(item).text().trim();

            if (headerText === "CD") hasCdHeader = true;
            if (headerText === "#") hasNumberHeader = true;

            // Exclude non-format headers
            if (!["", "&nbsp;", "CD", "#", "Song Name"].includes(headerText)) {
                soundtrack.formats.push(headerText.toLowerCase());
            }
        });
        console.log(`[GetSoundtrackMeta] Formats: ${soundtrack.formats.join(", ")}`);

        // Determine the title column index
        let titleColumn = 2;
        if (hasCdHeader) titleColumn++;
        if (hasNumberHeader) titleColumn++;

        // Retrieve songs
        const songListRows = $("#songlist tr").not("[id]"); // Select all <tr> within #songlist, excluding those with an id
        songListRows.each((_, row) => {
            const cells = $(row).find("td"); // Get all <td> elements in the row
            const songAnchor = $(cells[titleColumn - 1]).find("a"); // Locate the <a> in the correct column (0-based index)
            if (songAnchor.length) {
                const href = songAnchor.attr("href");
                const song = {
                    title: songAnchor.text().trim(),
                    url: `https://downloads.khinsider.com${href}`
                };
                soundtrack.songs.push(song);
            }
        });
        console.log(`[GetSoundtrackMeta] Songs: ${soundtrack.songs.length}`);

        return soundtrack;
    } catch (error) {
        console.error(`[GetSoundtrackMeta] Error: ${error.message}`);
        return null;
    }
}

module.exports = { getSoundtrackMeta };