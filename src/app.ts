import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import userRoutes from './routes/userRoutes.js';
import studentRoutes from './routes/studentRoutes.js';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDirectory = path.resolve(__dirname, '../public');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/css', express.static(path.join(publicDirectory, 'css')));
app.use('/js', express.static(path.join(publicDirectory, 'js')));
app.use('/image', express.static(path.join(publicDirectory, 'image')));
app.use(express.static(publicDirectory));

app.get('/', (_req, res) => {
    res.redirect('/login');
});

app.get('/login', (_req, res) => {
    res.sendFile(path.join(publicDirectory, 'login.html'));
});

app.get('/dashboard', (_req, res) => {
    res.sendFile(path.join(publicDirectory, 'dashboard.html'));
});

app.use('/api', userRoutes);
app.use('/api', studentRoutes);

app.use((error: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error(error);
    res.status(500).json({
        success: false,
        message: error.message || 'Terjadi kesalahan server.'
    });
});

export default app;
