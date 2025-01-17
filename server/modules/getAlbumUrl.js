function getAlbumUrl(urlOrSlug) {
    return urlOrSlug.startsWith("https://downloads.khinsider.com")
        ? urlOrSlug
        : `https://downloads.khinsider.com/game-soundtracks/album/${urlOrSlug}`;
}

module.exports = { getAlbumUrl };