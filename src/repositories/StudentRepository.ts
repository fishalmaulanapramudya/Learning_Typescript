import { pool } from '../config/database.js';
import type { IStudentRepository } from '../interfaces/IStudentRepository.js';
import type { CreateStudentDTO, StudentRecord, UpdateStudentDTO } from '../types/StudentTypes.js';

export class StudentRepository implements IStudentRepository {
    async findAll(): Promise<StudentRecord[]> {
        const result = await pool.query(
            `SELECT id, nis, nama, kelas, jurusan, email, created_at AS "createdAt", updated_at AS "updatedAt"
             FROM students ORDER BY id ASC`
        );

        return result.rows;
    }

    async findById(id: number): Promise<StudentRecord | null> {
        const result = await pool.query(
            `SELECT id, nis, nama, kelas, jurusan, email, created_at AS "createdAt", updated_at AS "updatedAt"
             FROM students WHERE id = $1`,
            [id]
        );

        return result.rows[0] ?? null;
    }

    async create(data: CreateStudentDTO): Promise<StudentRecord> {
        const result = await pool.query(
            `INSERT INTO students (nis, nama, kelas, jurusan, email)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING id, nis, nama, kelas, jurusan, email, created_at AS "createdAt", updated_at AS "updatedAt"`,
            [data.nis, data.nama, data.kelas, data.jurusan, data.email]
        );

        return result.rows[0];
    }

    async update(id: number, data: UpdateStudentDTO): Promise<StudentRecord | null> {
        const fields: string[] = [];
        const values: unknown[] = [];
        let index = 1;

        if (data.nis !== undefined) {
            fields.push(`nis = $${index}`);
            values.push(data.nis.trim());
            index += 1;
        }

        if (data.nama !== undefined) {
            fields.push(`nama = $${index}`);
            values.push(data.nama.trim());
            index += 1;
        }

        if (data.kelas !== undefined) {
            fields.push(`kelas = $${index}`);
            values.push(data.kelas.trim());
            index += 1;
        }

        if (data.jurusan !== undefined) {
            fields.push(`jurusan = $${index}`);
            values.push(data.jurusan.trim());
            index += 1;
        }

        if (data.email !== undefined) {
            fields.push(`email = $${index}`);
            values.push(data.email.trim());
            index += 1;
        }

        if (fields.length === 0) {
            return null;
        }

        fields.push(`updated_at = NOW()`);
        values.push(id);

        const result = await pool.query(
            `UPDATE students SET ${fields.join(', ')} WHERE id = $${index} RETURNING id, nis, nama, kelas, jurusan, email, created_at AS "createdAt", updated_at AS "updatedAt"`,
            values
        );

        return result.rows[0] ?? null;
    }

    async delete(id: number): Promise<boolean> {
        const result = await pool.query('DELETE FROM students WHERE id = $1', [id]);
        return (result.rowCount ?? 0) > 0;
    }
}
