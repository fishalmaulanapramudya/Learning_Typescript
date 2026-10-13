import type { NextFunction, Request, Response } from 'express';
import { verifyToken } from '../config/jwt.js';

export interface AuthenticatedRequest extends Request {
    user?: {
        userId: number;
        username: string;
        email: string;
    };
}

export function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
    const authHeader = req.headers.authorization ?? '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';

    if (!token) {
        res.status(401).json({
            success: false,
            message: 'Token JWT tidak ditemukan. Silakan login terlebih dahulu.'
        });
        return;
    }

    try {
        const decoded = verifyToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({
            success: false,
            message: 'Token JWT tidak valid atau sudah kedaluwarsa.'
        });
    }
}
