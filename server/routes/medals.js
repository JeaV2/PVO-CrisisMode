import { readFromDatabase } from '../modules/database.js';
import { verifyToken } from '../modules/encrypt.js';

function getVerifiedToken(req, res) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ message: 'Authorization header mist of is ongeldig' });
        return null;
    }

    const token = authHeader.slice('Bearer '.length).trim();

    if (!token) {
        res.status(401).json({ message: 'Token ontbreekt' });
        return null;
    }

    return verifyToken(token);
}

async function getMedals(req, res) {
    try {
        const decodedToken = getVerifiedToken(req, res);

        if (!decodedToken) {
            return;
        }

        const medals = await readFromDatabase(['*'], "BehaaldeMedailles", "UUID", decodedToken.UUID)


        return res.status(200).json({ medals: medals });
    } catch (error) {
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Foute of verlopen token' });
        }

        console.error('Medals endpoint failed:', error);
        return res.status(500).json({ message: 'Interne serverfout' });
    }
}

export { getMedals };