const express = require('express');
const Router = express.Router;

const router = new Router();

router.use('/soundtrack', require('./soundtrack'));

module.exports = router;