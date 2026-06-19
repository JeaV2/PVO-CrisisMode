import bcrypt from 'bcrypt';
import 'dotenv/config';
import jwt from 'jsonwebtoken';

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

async function signToken(payload) {
    const secretKey = process.env.JWT_SECRET;
    if (!secretKey) {
        throw new Error('JWT_SECRET environment variable is not set');
    }
    return jwt.sign(payload, secretKey, { expiresIn: '10d' });
}


export { hashPassword, comparePassword, signToken };