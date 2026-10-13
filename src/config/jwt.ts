import 'dotenv/config';
import jwt from 'jsonwebtoken';
import type { SignOptions } from 'jsonwebtoken';

export const JWT_SECRET = process.env.JWT_SECRET ?? 'demo-secret-key';
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? '8h';

export interface AuthPayload {
    userId: number;
    username: string;
    email: string;
}

export function signToken(payload: AuthPayload): string {
    const options = {
        expiresIn: JWT_EXPIRES_IN
    } as SignOptions;

    return jwt.sign(payload, JWT_SECRET, options);
}

export function verifyToken(token: string): AuthPayload {
    return jwt.verify(token, JWT_SECRET) as AuthPayload;
}
