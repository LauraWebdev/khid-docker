const axios = require('axios');
const cheerio = require('cheerio');

async function getSoundtrackMeta(urlOrSlug) {
    console.log(`[DownloadQueue] GetSoundtrackMeta: ${urlOrSlug}`);

    // Build the album URL
    const albumUrl = urlOrSlug.startsWith("https://downloads.khinsider.com")
        ? urlOrSlug
        : `https://downloads.khinsider.com/game-soundtracks/album/${urlOrSlug}`;

    try {
        // Fetch the album webpage
        const response = await axios.get(albumUrl);
        const html = response.data;
        const $ = cheerio.load(html);

        // Check if the soundtrack page exists
        const pageTitle = $("head > title").text();
        if (pageTitle === "Error") {
            console.log("[DownloadQueue] Soundtrack does not exist!");
            return null;
        }

        // Retrieve the album title
        const albumTitle = $("#pageContent > h2").first().text().trim();
        console.log(`[DownloadQueue] Soundtrack Name: ${albumTitle}`);

        // Initialize the soundtrack object
        const soundtrack = {
            Url: albumUrl,
            Title: albumTitle,
            Slug: albumUrl.replace("https://downloads.khinsider.com/game-soundtracks/album/", ""),
            Formats: [],
            Songs: []
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
                soundtrack.Formats.push(headerText.toLowerCase());
            }
        });
        console.log(`[DownloadQueue] Formats: ${soundtrack.Formats.join(", ")}`);

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
                    Title: songAnchor.text().trim(),
                    Url: `https://downloads.khinsider.com${href}`
                };
                soundtrack.Songs.push(song);
            }
        });
        console.log(`[DownloadQueue] Songs: ${soundtrack.Songs.length}`);

        return soundtrack;
    } catch (error) {
        console.error(`[DownloadQueue] Error: ${error.message}`);
        return null;
    }
}

module.exports = { getSoundtrackMeta };