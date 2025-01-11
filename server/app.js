const express = require('express');
const path = require("path");
const listEndpoints = require('express-list-endpoints');

const app = express();
app.use(express.json());

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
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));