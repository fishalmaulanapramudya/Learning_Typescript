import { Pool } from 'pg';
import "dotenv/config";

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
    port: port,
    user: requiredEnv('DB_USER'),
    password: requiredEnv('DB_PASSWORD'),
    database: requiredEnv('DB_NAME')
});
