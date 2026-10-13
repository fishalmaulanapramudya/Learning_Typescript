import type { IUserRepository } from '../interfaces/IUserRepository.js';
import { pool } from '../config/database.js';
import type { PublicUser, StoredUser, UpdateUserDTO } from '../types/UserTypes.js';

export class UserRepository implements IUserRepository {
    async findAll(): Promise<PublicUser[]> {
        const result = await pool.query(
            'SELECT id, username, email FROM users ORDER BY id ASC'
        );

        return result.rows;
    }

    async findById(id: number): Promise<PublicUser | null> {
        const result = await pool.query(
            'SELECT id, username, email FROM users WHERE id = $1',
            [id]
        );

        return result.rows[0] ?? null;
    }

    async findByUsername(username: string): Promise<StoredUser | null> {
        const result = await pool.query(
            'SELECT id, username, email, password_hash AS "passwordHash" FROM users WHERE LOWER(username) = LOWER($1)',
            [username]
        );

        return result.rows[0] ?? null;
    }

    async create(data: { username: string; email: string; passwordHash: string }): Promise<PublicUser> {
        const result = await pool.query(
            'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email',
            [data.username, data.email, data.passwordHash]
        );

        return result.rows[0];
    }

    async update(id: number, data: UpdateUserDTO & { passwordHash?: string }): Promise<PublicUser | null> {
        const fields: string[] = [];
        const values: unknown[] = [];
        let index = 1;

        if (data.username !== undefined) {
            fields.push(`username = $${index}`);
            values.push(data.username.trim());
            index += 1;
        }

        if (data.email !== undefined) {
            fields.push(`email = $${index}`);
            values.push(data.email.trim());
            index += 1;
        }

        if (data.passwordHash !== undefined) {
            fields.push(`password_hash = $${index}`);
            values.push(data.passwordHash);
            index += 1;
        }

        if (fields.length === 0) {
            return null;
        }

        values.push(id);
        const result = await pool.query(
            `UPDATE users SET ${fields.join(', ')} WHERE id = $${index} RETURNING id, username, email`,
            values
        );

        return result.rows[0] ?? null;
    }

    async delete(id: number): Promise<boolean> {
        const result = await pool.query('DELETE FROM users WHERE id = $1', [id]);
        return (result.rowCount ?? 0) > 0;
    }
}