const express = require('express');
const path = require("path");
const cors = require('cors');
const listEndpoints = require('express-list-endpoints');

const OUTPUT_DIR = process.env.OUTPUT_DIR || path.join(process.cwd(), '..');
const REQUEST_TIMEOUT = process.env.REQUEST_TIMEOUT || 30000;

console.log("[KHID WebUI] Starting");
console.info(`[KHID WebUI] OUTPUT_DIR: ${OUTPUT_DIR}`);
console.info(`[KHID WebUI] REQUEST_TIMEOUT: ${REQUEST_TIMEOUT}`);

const app = express();
app.use(express.json({
    limit: '50mb'
}));
app.use(cors());

// Server Routes
app.use('/api', require('./routes'));

app.get('/api/', (req, res) => {
    res.status(200).json(listEndpoints(app));
});

// UI
app.use(express.static(path.join(__dirname, '../ui/dist')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../ui/dist/index.html'));
});

// Start server
app.listen(8080, () => console.log(`[KHID WebUI] Server started on port 8080`));