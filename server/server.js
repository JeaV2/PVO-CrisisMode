import express from 'express';

const app = express();
const HOST = '127.0.0.1';
const PORT = 5500;

app.get('/', (_req, res) => {
    res.send('Server is running');
});

app.listen(PORT, HOST, () => {
    console.log(`Express server running at http://${HOST}:${PORT}`);
});
