// Node modules
import express from 'express';
import cors from 'cors';
import 'dotenv/config';


// Local modules
import { register, login } from './routes/auth.js';
import { getMedals, createMedal } from './routes/medals.js';

const app = express();
const HOST = process.env.HOST;
const PORT = process.env.PORT;

if (!HOST || !PORT) {
    throw new Error('HOST and PORT environment variables must be set');
}

app.use(express.json());
app.use(cors());

app.get('/', (_req, res) => {
    res.send('Server is running');
});

app.post('/auth/login/', (req, res) => {
    login(req, res);
});

app.post('/auth/register/', (req, res) => {
    register(req, res);
});

app.get('/medals/', (req, res) => {
    getMedals(req, res);
});

app.post('/medal/', (req, res) => {
    createMedal(req, res);
});


app.listen(PORT, HOST, () => {
    console.log(`Express server running at http://${HOST}:${PORT}`);
});
