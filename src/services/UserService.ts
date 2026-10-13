import bcrypt from 'bcrypt';
import { signToken } from '../config/jwt.js';
import { UserRepository } from '../repositories/UserRepository.js';
import type { CreateUserDTO, PublicUser, UpdateUserDTO } from '../types/UserTypes.js';

export class UserService {
    constructor(private readonly userRepository = new UserRepository()) {}

    async login(username: string, password: string): Promise<{ user: PublicUser; token: string }> {
        const cleanUsername = username.trim();

        if (!cleanUsername || !password.trim()) {
            throw new Error('Username dan password wajib diisi.');
        }

        const user = await this.userRepository.findByUsername(cleanUsername);

        if (!user) {
            throw new Error('Username atau password salah.');
        }

        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

        if (!isPasswordValid) {
            throw new Error('Username atau password salah.');
        }

        const payloadUser = {
            id: user.id,
            username: user.username,
            email: user.email
        };

        return {
            user: payloadUser,
            token: signToken({
                userId: user.id,
                username: user.username,
                email: user.email
            })
        };
    }

    async register(data: Partial<CreateUserDTO>): Promise<PublicUser> {
        const payload = this.validateUserData(data);
        const existing = await this.userRepository.findByUsername(payload.username);

        if (existing) {
            throw new Error('Username sudah digunakan.');
        }

        const passwordHash = await bcrypt.hash(payload.password, 10);
        return this.userRepository.create({
            username: payload.username,
            email: payload.email,
            passwordHash
        });
    }

    async getAllUsers(): Promise<PublicUser[]> {
        return this.userRepository.findAll();
    }

    async getUserById(id: number): Promise<PublicUser> {
        const user = await this.userRepository.findById(id);

        if (!user) {
            throw new Error('User tidak ditemukan.');
        }

        return user;
    }

    async updateUser(id: number, data: Partial<UpdateUserDTO & { password?: string }>): Promise<PublicUser> {
        const payload: Partial<UpdateUserDTO & { passwordHash?: string }> = {};

        if (data.username) {
            const username = data.username.trim();
            if (username.length < 3) {
                throw new Error('Username minimal 3 karakter.');
            }
            payload.username = username;
        }

        if (data.email) {
            const email = data.email.trim();
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                throw new Error('Format email tidak valid.');
            }
            payload.email = email;
        }

        if (data.password) {
            const password = data.password.trim();
            if (password.length < 6) {
                throw new Error('Password minimal 6 karakter.');
            }
            payload.passwordHash = await bcrypt.hash(password, 10);
        }

        if (Object.keys(payload).length === 0) {
            throw new Error('Minimal satu field harus diubah.');
        }

        const updated = await this.userRepository.update(id, payload);

        if (!updated) {
            throw new Error('User tidak ditemukan.');
        }

        return updated;
    }

    async deleteUser(id: number): Promise<boolean> {
        return this.userRepository.delete(id);
    }

    private validateUserData(data: Partial<CreateUserDTO>): CreateUserDTO {
        const username = String(data.username ?? '').trim();
        const email = String(data.email ?? '').trim();
        const password = String(data.password ?? '').trim();

        if (!username || !email || !password) {
            throw new Error('Username, email, dan password wajib diisi.');
        }

        if (username.length < 3) {
            throw new Error('Username minimal 3 karakter.');
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            throw new Error('Format email tidak valid.');
        }

        if (password.length < 6) {
            throw new Error('Password minimal 6 karakter.');
        }

        return { username, email, password };
    }
}
