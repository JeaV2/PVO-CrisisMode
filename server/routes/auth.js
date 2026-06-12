import { validateSignUpData, validateLoginData } from '../modules/validate.js';
import { writeToDatabase, loginGetPassword, checkUniqueUser } from '../modules/database.js';
import { hashPassword, comparePassword } from '../modules/encrypt.js';

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


async function register(req, res) {
    try {
        console.log('Registratie endpoint benaderd');
        const data = req.body;
        const errors = validateSignUpData(data);

        if (Object.keys(errors).length > 0) {
            console.log('Validatiefouten:', errors);
            return res.status(400).json({ errors });
        }

        data.Wachtwoord = await hashPassword(data.Wachtwoord);

        data.UUID = crypto.randomUUID();
        console.log('Geldige registratiegegevens:', data);

        const uniqueness = await checkUniqueUser(data.Username, data.Email);
        if (!uniqueness.Username.unique || !uniqueness.Email.unique) {
            console.log('Uniciteitsfouten:', uniqueness);
            return res.status(400).json({ errors: uniqueness });
        }

        const gebruikerData = {
            UUID: data.UUID,
            Voornaam: data.Voornaam,
            Achternaam: data.Achternaam,
            Username: data.Username,
            Email: data.Email,
            Wachtwoord: data.Wachtwoord,
            ProfielFotoPath: data.ProfielFotoPath ?? null
        };

        await writeToDatabase(gebruikerData, 'Gebruikers');
        await writeToDatabase({ UUID: data.UUID }, 'BehaaldeMedailles');

        return res.status(201).json({ message: 'Registratie succesvol' });
    } catch (error) {
        const constraintResponse = mapSqliteConstraintErrors(error);
        if (constraintResponse) {
            console.log('Constraintfout:', error.message);
            return res.status(constraintResponse.statusCode).json(constraintResponse.body);
        }

        console.error('Registratie mislukt:', error);
        return res.status(500).json({ message: 'Interne serverfout' });
    }
}

async function login(req, res) {
    console.log('Login endpoint benaderd');
    const data = req.body;
    const errors = validateLoginData(data);

    if (Object.keys(errors).length > 0) {
        console.log('Validatiefouten:', errors);
        return res.status(400).json({ errors });
    }

    const gebruikerData = {
        Email: data.Email,
        Wachtwoord: data.Wachtwoord
    }
    try {
        const passwordHash = await loginGetPassword(gebruikerData.Email);
        let compare = await comparePassword(gebruikerData.Wachtwoord, passwordHash.Wachtwoord);
        if (await comparePassword(gebruikerData.Wachtwoord, passwordHash.Wachtwoord)) {
            return res.status(200).json({ message: 'Login succesvol' });
        } else {
            console.log('Ongeldig wachtwoord voor email:', gebruikerData.Email);
            return res.status(401).json({ message: 'Ongeldige inloggegevens' });
        }
    } catch (error) {
        console.error('Login mislukt:', error);
        return res.status(500).json({ message: 'Interne serverfout' });
    }
}

export { register, login };