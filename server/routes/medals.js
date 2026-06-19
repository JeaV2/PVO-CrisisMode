import { readFromDatabase } from '../modules/database.js';
import { verifyToken } from '../modules/encrypt.js';

async function getMedals(req, res) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Authorization header mist of is ongeldig' });
        }

        const token = authHeader.slice('Bearer '.length).trim();

        if (!token) {
            return res.status(401).json({ message: 'Token ontbreekt' });
        }

        const decodedToken = verifyToken(token);

        let medals = await readFromDatabase(['*'], "BehaaldeMedailles", "UUID", decodedToken.UUID)


        return res.status(200).json({ message: 'Token gevalideerd', medals: medals });
    } catch (error) {
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Foute of verlopen token' });
        }

        console.error('Medals endpoint failed:', error);
        return res.status(500).json({ message: 'Interne serverfout' });
    }
}

export { getMedals };