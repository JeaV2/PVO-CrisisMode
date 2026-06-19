import bcrypt from 'bcrypt';
import 'dotenv/config';
import jwt from 'jsonwebtoken';

const SALT_ROUNDS = parseInt(process.env.PSWD_SALTROUNDS);
const JWT_SECRET = process.env.JWT_SECRET;
if (isNaN(SALT_ROUNDS)) {
    throw new Error('SALT_ROUNDS environment variable must be a valid number');
}
if (!JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable must be set');
}

async function hashPassword(password) {
    return await bcrypt.hash(password, SALT_ROUNDS);
}

async function comparePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
}

async function signToken(payload) {
    const secretKey = process.env.JWT_SECRET;
    return jwt.sign(payload, secretKey, { expiresIn: '10d' });
}

function verifyToken(token) {
    const secretKey = process.env.JWT_SECRET;
    return jwt.verify(token, secretKey);
}

export { hashPassword, comparePassword, signToken, verifyToken };