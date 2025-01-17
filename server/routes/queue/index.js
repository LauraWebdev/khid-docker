const express = require('express');
const Router = express.Router;
const DownloadQueue = require('../../modules/queue');

const router = new Router();
const queue = new DownloadQueue();

router.get('/', (req, res) => {
    res.json({
        status: 200,
        data: {
            running: queue.isRunning,
            stats: {
                total: queue.queue.length,
                queued: queue.getQueued().length,
                downloading: queue.getDownloading().length,
                done: queue.getDone().length,
                failed: queue.getFailed().length,
            },
            queue: queue.queue
        },
    });
});

router.post('/add', async (req, res) => {
    if (req.body === undefined) {
        return res.json({
            status: 400,
            message: 'Body is required'
        });
    }

    queue.addToQueue(req.body);
    queue.run();

    res.json({
        status: 200,
        data: req.body
    });
});

router.get('/queued', (req, res) => {
    res.json({
        status: 200,
        data: queue.getQueued(),
    });
});

router.get('/downloading', (req, res) => {
    res.json({
        status: 200,
        data: queue.getDownloading(),
    });
});

router.get('/done', (req, res) => {
    res.json({
        status: 200,
        data: queue.getDone(),
    });
});

router.get('/failed', (req, res) => {
    res.json({
        status: 200,
        data: queue.getFailed(),
    });
});

router.get('/clearDone', (req, res) => {
    queue.clearDone();

    res.json({
        status: 200
    });
});

router.get('/retryFailed', (req, res) => {
    queue.retryFailed();

    res.json({
        status: 200
    });
});

module.exports = router;