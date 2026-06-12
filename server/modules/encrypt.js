import bcrypt from 'bcrypt';
import 'dotenv/config';

const SALT_ROUNDS = parseInt(process.env.PSWD_SALTROUNDS);
if (isNaN(SALT_ROUNDS)) {
    throw new Error('SALT_ROUNDS environment variable must be a valid number');
}

async function hashPassword(password) {
    return await bcrypt.hash(password, SALT_ROUNDS);
}

async function comparePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
}

export { hashPassword, comparePassword };