// Node modules
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';


const currentFilePath = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFilePath);
const databasePath = path.resolve(currentDirectory, '../crisismode.db');

const TABLE_COLUMNS = {
    Gebruikers: [
        'UUID',
        'Voornaam',
        'Achternaam',
        'Username',
        'Email',
        'Wachtwoord',
        'ProfielFotoPath'
    ],
    BehaaldeMedailles: [
        'UUID',
        'Casus1',
        'Casus2',
        'Casus3',
        'Casus4',
        'Casus5',
        'Casus6',
        'Casus7',
        'Casus8',
        'Casus9',
        'Casus10',
        '*'
    ]
};

const dbPromise = open({
    filename: databasePath,
    driver: sqlite3.Database
});

function writeToDatabase(data, table) {
    return dbPromise.then(db => {
        const allowedTables = TABLE_COLUMNS[table];

        if (!allowedTables) {
            throw new Error(`Unknown table: ${table}`);
        }

        const unexpectedColumns = Object.keys(data).filter(column => !allowedTables.includes(column));

        if (unexpectedColumns.length > 0) {
            throw new Error(`Unexpected columns for ${table}: ${unexpectedColumns.join(', ')}`);
        }

        const columns = Object.keys(data).join(', ');
        const placeholders = Object.keys(data).map(() => '?').join(', ');
        const values = Object.values(data);
        const sql = `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`;
        return db.run(sql, values);
    }).catch(err => {
        throw err;
    });
};

async function readFromDatabase(data, table, whereColumn, whereClause) {
    return dbPromise.then(db => {

        const allowedTables = TABLE_COLUMNS[table];

        if (!allowedTables) {
            throw new Error(`Unknown table: ${table}`);
        }

        const unexpectedColumns = data.filter(column => !allowedTables.includes(column) && !allowedTables.includes(whereColumn));

        if (unexpectedColumns.length > 0) {
            throw new Error(`Unexpected columns for ${table}: ${unexpectedColumns.join(', ')}`);
        }

        let columns = data.join(', ');
        const sql = `SELECT ${columns} FROM ${table} WHERE ${whereColumn} = ?`;
        return db.get(sql, [whereClause]);

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

function mapSqliteConstraintErrors(error) {
    if (!error?.code || !String(error.code).startsWith('SQLITE_CONSTRAINT')) {
        return null;
    }

    const message = String(error.message || '');
    const errors = {};

    if (message.includes('Gebruikers.Username')) {
        errors.Username = { unique: false, message: 'Username is al in gebruik' };
    }

    if (message.includes('Gebruikers.Email')) {
        errors.Email = { unique: false, message: 'Email is al in gebruik' };
    }

    if (Object.keys(errors).length > 0) {
        return { statusCode: 400, body: { errors } };
    }

    return {
        statusCode: 400,
        body: { message: 'Database constraint geschonden' }
    };
}

export { writeToDatabase, readFromDatabase, checkUniqueUser, mapSqliteConstraintErrors };