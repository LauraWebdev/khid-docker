function sanitizeFilename(title) {
    return title.replace(/\s+/g, '_').replace(/[^\w\-_]/g, '');
}

module.exports = sanitizeFilename;