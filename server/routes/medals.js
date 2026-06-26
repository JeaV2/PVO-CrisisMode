// Node modules
import 'dotenv/config';

// Local modules
import { readFromDatabase, writeToDatabase } from '../modules/database.js';
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

async function createMedal(req, res) {
    try {
        const decodedToken = getVerifiedToken(req, res);
        if (!decodedToken) {
            return;
        }

        const casus = req.body.casus;

        if (typeof casus !== 'string') {
            return res.status(400).json({ message: 'Ongeldige casus' });
        }

        const medalResult = await determineMedalGrade(casus);

        if (!medalResult.unlocked) {
            return res.status(403).json({ message: 'Deze casus is nog niet vrijgegeven' });
        }

        const medalData = {
            [casus]: medalResult.grade
        };

        await writeToDatabase(medalData, 'BehaaldeMedailles', 'UUID', decodedToken.UUID);

        return res.status(201).json({ message: 'Medaille succesvol toegevoegd' });


    } catch (error) {
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Foute of verlopen token' });
        }

        console.error('Create medal endpoint failed:', error);
        return res.status(500).json({ message: 'Interne serverfout' });
    }
}

async function determineMedalGrade(casus) {
    const casusNumber = getCasusNumber(casus);
    const msPerDay = 1000 * 60 * 60 * 24;

    if (!casusNumber) {
        return { unlocked: false, grade: null };
    }

    const campaignStartDate = getCampaignStartDate();
    const unlockDate = addDaysUtc(campaignStartDate, casusNumber - 1);
    const currentDate = getUtcDateOnly(new Date());
    const unlockDateOnly = getUtcDateOnly(unlockDate);
    const daysSinceUnlock = Math.floor((currentDate - unlockDateOnly) / msPerDay);

    const medalGrades = ['goud', 'zilver', 'brons'];
    switch (daysSinceUnlock) {
        case daysSinceUnlock < 0:
            return { unlocked: false, grade: null };
        case 0:
            return { unlocked: true, grade: medalGrades[0] /*goud*/ };
        case 1:
            return { unlocked: true, grade: medalGrades[1] /*zilver*/ };
        default:
            return { unlocked: true, grade: medalGrades[2] /*brons*/ };
    }
}

function getCampaignStartDate() {
    const rawStartDate = process.env.CAMPAIGN_START_DATE;

    if (!rawStartDate) {
        throw new Error('CAMPAIGN_START_DATE environment variable must be set');
    }

    const campaignStartDate = new Date(`${rawStartDate}T00:00:00Z`);

    if (Number.isNaN(campaignStartDate.getTime())) {
        throw new Error('CAMPAIGN_START_DATE environment variable is invalid');
    }

    return campaignStartDate;
}

function getCasusNumber(casus) {
    const maxCasus = 10;

    const match = /^Casus(10|[1-9])$/.exec(casus);

    if (!match) {
        return null;
    }

    const casusNumber = Number.parseInt(match[1], 10);

    if (!Number.isInteger(casusNumber) || casusNumber < 1 || casusNumber > maxCasus) {
        return null;
    }

    return casusNumber;
}

function addDaysUtc(date, days) {
    const nextDate = new Date(date.getTime());
    nextDate.setUTCDate(nextDate.getUTCDate() + days);
    return nextDate;
}

function getUtcDateOnly(date) {
    return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
}

export { getMedals, createMedal };