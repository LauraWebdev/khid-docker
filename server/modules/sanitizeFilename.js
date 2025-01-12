const wanakana = require('wanakana');

function sanitizeFilename(title) {
    title = wanakana.toRomaji(title, { upcaseKatakana: true });

    return title.replace(/\s+/g, '_').replace(/[^\w\-_]/g, '');
}

module.exports = sanitizeFilename;