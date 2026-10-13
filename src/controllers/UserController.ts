import type { Request, Response } from 'express';
import { UserService } from '../services/UserService.js';

export class UserController {
    constructor(private readonly userService = new UserService()) {}

    async login(req: Request, res: Response): Promise<void> {
        try {
            const username = String(req.body?.username ?? '').trim();
            const password = String(req.body?.password ?? '');
            const result = await this.userService.login(username, password);

            res.status(200).json({
                success: true,
                message: 'Login berhasil.',
                data: result
            });
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Login gagal.';
            res.status(400).json({ success: false, message });
        }
    }

    async register(req: Request, res: Response): Promise<void> {
        try {
            const user = await this.userService.register(req.body ?? {});
            res.status(201).json({
                success: true,
                message: 'User berhasil dibuat.',
                data: user
            });
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Registrasi gagal.';
            res.status(400).json({ success: false, message });
        }
    }

    async getUsers(_req: Request, res: Response): Promise<void> {
        try {
            const users = await this.userService.getAllUsers();
            res.status(200).json({ success: true, data: users });
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Gagal mengambil data user.';
            res.status(400).json({ success: false, message });
        }
    }

    async getUserById(req: Request, res: Response): Promise<void> {
        try {
            const id = Number(req.params.id);

            if (!Number.isInteger(id)) {
                res.status(400).json({ success: false, message: 'ID user tidak valid.' });
                return;
            }

            const user = await this.userService.getUserById(id);
            res.status(200).json({ success: true, data: user });
        } catch (error) {
            const message = error instanceof Error ? error.message : 'User tidak ditemukan.';
            res.status(404).json({ success: false, message });
        }
    }

    async updateUser(req: Request, res: Response): Promise<void> {
        try {
            const id = Number(req.params.id);

            if (!Number.isInteger(id)) {
                res.status(400).json({ success: false, message: 'ID user tidak valid.' });
                return;
            }

            const user = await this.userService.updateUser(id, req.body ?? {});
            res.status(200).json({
                success: true,
                message: 'User berhasil diperbarui.',
                data: user
            });
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Gagal memperbarui user.';
            res.status(400).json({ success: false, message });
        }
    }

    async deleteUser(req: Request, res: Response): Promise<void> {
        try {
            const id = Number(req.params.id);

            if (!Number.isInteger(id)) {
                res.status(400).json({ success: false, message: 'ID user tidak valid.' });
                return;
            }

            const deleted = await this.userService.deleteUser(id);
            res.status(200).json({
                success: deleted,
                message: deleted ? 'User berhasil dihapus.' : 'User tidak ditemukan.'
            });
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Gagal menghapus user.';
            res.status(400).json({ success: false, message });
        }
    }

    logout(_req: Request, res: Response): void {
        res.status(200).json({
            success: true,
            message: 'Logout berhasil.'
        });
    }
}
