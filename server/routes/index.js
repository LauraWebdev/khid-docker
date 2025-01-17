const express = require('express');
const Router = express.Router;

const router = new Router();

router.use('/queue', require('./queue'));
router.use('/soundtrack', require('./soundtrack'));
router.use('/heartbeat', require('./heartbeat'));

module.exports = router;