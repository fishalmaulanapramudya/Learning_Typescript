import { pool } from '../config/database.js';
import { IUserRepository } from '../interfaces/IUserRepository.js';
import { StoredUser, PublicUser, UpdateUserDTO } from '../types/UserTypes.js';

export class UserRepository implements IUserRepository {
    async findAll(): Promise<PublicUser[]> {
        const result = await pool.query(
            `SELECT id, username, email FROM users ORDER BY id ASC`
        );

        return result.rows;
    }

    async findById(id: number): Promise<PublicUser | null> {
        const result = await pool.query(
            `SELECT id, username, email FROM users WHERE id = $1`,
            [id]
        );

        return result.rows[0] ?? null;
    }

    async findByUsername(username: string): Promise<StoredUser | null> {
        const result = await pool.query(
            `SELECT id, username, email, password_hash AS "passwordHash" FROM users WHERE username = $1`,
            [username]
        );

        return result.rows[0] ?? null;
    }

    async create(data: { username: string; email: string; passwordHash: string }): Promise<PublicUser> {
        const result = await pool.query(
            `INSERT INTO users (username, email, password_hash)
             VALUES ($1, $2, $3)
             RETURNING id, username, email`,
            [data.username, data.email, data.passwordHash]
        );

        return result.rows[0];
    }

    async update(id: number, data: UpdateUserDTO & { passwordHash?: string }): Promise<PublicUser | null> {
        const result = await pool.query(
            'UPDATE users SET username = COALESCE($1, username), email = COALESCE($2, email), password_hash = COALESCE($3, password_hash) WHERE id = $4 RETURNING id, username, email',
            [data.username ?? null, data.email ?? null, data.passwordHash ?? null, id]
        );

        return result.rows[0] ?? null;
    }

    async delete(id: number): Promise<boolean> {
        const result = await pool.query(
            `DELETE FROM users WHERE id = $1`,
            [id]
        );

        return (result.rowCount ?? 0) > 0;
    }
}