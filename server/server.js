// Node modules
import express from 'express';

// Local modules
import { register } from './routes/auth.js';

const app = express();
const HOST = '127.0.0.1';
const PORT = 5500;

app.use(express.json());

app.get('/', (_req, res) => {
    res.send('Server is running');
});

app.post('/auth/login/', (req, res) => {
    res.send('Login endpoint');
});

app.post('/auth/register/', (req, res) => {
    register(req, res);
});


app.listen(PORT, HOST, () => {
    console.log(`Express server running at http://${HOST}:${PORT}`);
});
