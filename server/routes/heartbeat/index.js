const express = require('express');
const Router = express.Router;

const router = new Router();
const serverStart = Date.now();

router.get('/', (req, res) => {
    const uptime = (Date.now() - serverStart) / 1000;

    res.json({
        status: 200,
        uptime: uptime
    });
});

module.exports = router;