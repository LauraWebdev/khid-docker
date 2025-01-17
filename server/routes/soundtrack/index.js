const express = require('express');
const {getSoundtrackMeta} = require("../../modules/getSoundtrackMeta");
const {getSoundtrackCovers} = require("../../modules/getSoundtrackCovers");
const Router = express.Router;

const router = new Router();

router.get('/', (req, res) => {
    res.json({
        status: 200,
    });
});

router.post('/', async (req, res) => {
    if (req.body.urlOrSlug === undefined) {
        return res.json({
            status: 400,
            message: '`urlOrSlug` is required'
        });
    }

    let soundtrackMeta = await getSoundtrackMeta(req.body.urlOrSlug);

    res.json({
        status: 200,
        data: soundtrackMeta
    });
});

router.post('/covers', async (req, res) => {
    if (req.body.urlOrSlug === undefined) {
        return res.json({
            status: 400,
            message: '`urlOrSlug` is required'
        });
    }

    let soundtrackCovers = await getSoundtrackCovers(req.body.urlOrSlug);

    res.json({
        status: 200,
        data: soundtrackCovers
    });
});

module.exports = router;