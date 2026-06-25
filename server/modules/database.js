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


/**
 * 
 * @param {*} data data to write to the database
 * @param {*} table to which table to write
 * @param {*} whereColumn 
 * @param {*} whereClause 
 * @returns 
 */
async function writeToDatabase(data, table, whereColumn, whereClause) {
    return dbPromise.then(db => {
        const allowedTables = TABLE_COLUMNS[table];

        if (!allowedTables) {
            throw new Error(`Unknown table: ${table}`);
        }

        const rowData = {
            ...data,
            [whereColumn]: whereClause
        };
        const columns = Object.keys(rowData);
        const unexpectedColumns = columns.filter(column => !allowedTables.includes(column));

        if (unexpectedColumns.length > 0) {
            throw new Error(`Unexpected columns for ${table}: ${unexpectedColumns.join(', ')}`);
        }

        const placeholders = columns.map(() => '?').join(', ');
        const values = Object.values(rowData);
        const updateColumns = columns.filter(column => column !== whereColumn);

        let sql = `INSERT INTO ${table} (${columns.join(', ')}) VALUES (${placeholders})`;

        if (updateColumns.length > 0) {
            const updateAssignments = updateColumns.map(column => `${column} = excluded.${column}`).join(', ');
            sql += ` ON CONFLICT(${whereColumn}) DO UPDATE SET ${updateAssignments}`;
        } else {
            sql += ` ON CONFLICT(${whereColumn}) DO NOTHING`;
        }

        return db.run(sql, values);
    }).catch(err => {
        throw err;
    });
};

/**
 * 
 * @param {*} data data to read from the database
 * @param {*} table from which table to read
 * @param {*} whereColumn 
 * @param {*} whereClause 
 * @returns 
 */
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

/**
 * 
 * @param {*} username the username to check for
 * @param {*} email the email address to check for
 * @returns 
 */
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