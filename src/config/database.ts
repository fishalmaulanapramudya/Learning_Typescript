import 'dotenv/config';
import bcrypt from 'bcrypt';
import { Pool } from 'pg';

function requiredEnv(name: string): string {
    const value = process.env[name];

    if (!value) {
        throw new Error(`Environment variable ${name} belum diatur!`);
    }

    return value;
}

const port = Number(process.env.DB_PORT ?? 5432);

if (!Number.isInteger(port) || port <= 0) {
    throw new Error('DB_PORT harus berupa angka yang valid!');
}

export const pool = new Pool({
    host: requiredEnv('DB_HOST'),
    port,
    user: requiredEnv('DB_USER'),
    password: requiredEnv('DB_PASSWORD'),
    database: requiredEnv('DB_NAME')
});

export async function initializeDatabase(): Promise<void> {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(100) UNIQUE NOT NULL,
            email VARCHAR(150) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL
        )
    `);

    await pool.query(`
        CREATE TABLE IF NOT EXISTS students (
            id SERIAL PRIMARY KEY,
            nis VARCHAR(30) UNIQUE NOT NULL,
            nama VARCHAR(150) NOT NULL,
            kelas VARCHAR(30) NOT NULL,
            jurusan VARCHAR(100) NOT NULL,
            email VARCHAR(150) UNIQUE NOT NULL,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
    `);

    const userRows = await pool.query('SELECT id, password_hash FROM users');

    for (const row of userRows.rows) {
        const hash = String(row.password_hash ?? '');

        if (!hash.startsWith('$2')) {
            const newHash = await bcrypt.hash(hash, 10);
            await pool.query('UPDATE users SET password_hash = $1 WHERE id = $2', [newHash, row.id]);
        }
    }

    const adminUser = await pool.query('SELECT id FROM users WHERE username = $1', ['admin']);

    if (adminUser.rowCount === 0) {
        await pool.query(
            'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3)',
            ['admin', 'admin@school.test', await bcrypt.hash('admin123', 10)]
        );
    }

    const studentCount = await pool.query('SELECT COUNT(*) AS total FROM students');
    if (Number(studentCount.rows[0]?.total ?? 0) === 0) {
        await pool.query(
            `INSERT INTO students (nis, nama, kelas, jurusan, email)
             VALUES
             ($1, $2, $3, $4, $5),
             ($6, $7, $8, $9, $10),
             ($11, $12, $13, $14, $15)`,
            [
                '2024001', 'Rizki Pratama', 'XII-A', 'Rekayasa Perangkat Lunak', 'rizki@example.com',
                '2024002', 'Nadia Putri', 'XII-B', 'Teknik Komputer Jaringan', 'nadia@example.com',
                '2024003', 'Bima Wijaya', 'XII-C', 'Multimedia', 'bima@example.com'
            ]
        );
    }
}

