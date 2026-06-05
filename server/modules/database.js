// Node modules
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';


const currentFilePath = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFilePath);
const databasePath = path.resolve(currentDirectory, '../crisismode.db');

const dbPromise = open({
    filename: databasePath,
    driver: sqlite3.Database
});

function writeToDatabase(data, table) {
    return dbPromise.then(db => {
        const columns = Object.keys(data).join(', ');
        const placeholders = Object.keys(data).map(() => '?').join(', ');
        const values = Object.values(data);
        const sql = `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`;
        return db.run(sql, values);
    }).catch(err => {
        throw err;
    });
};

async function checkUniqueUser(username, email) {
    const db = await dbPromise;
    const result = {
        Username: { unique: true, message: '' },
        Email: { unique: true, message: '' }
    };

    const usernameHit = await db.get('SELECT 1 FROM Gebruikers WHERE Username = ? LIMIT 1', [username]);
    const emailHit = await db.get('SELECT 1 FROM Gebruikers WHERE Email = ? LIMIT 1', [email]);

    if (usernameHit) {
        result.Username = { unique: false, message: 'Username is al in gebruik' };
    }

    if (emailHit) {
        result.Email = { unique: false, message: 'Email is al in gebruik' };
    }

    return result;
}

export { writeToDatabase, checkUniqueUser };