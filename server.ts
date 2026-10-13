import 'dotenv/config';
import app from './src/app.js';
import { initializeDatabase } from './src/config/database.js';

const PORT = Number(process.env.PORT ?? 3000);

await initializeDatabase();

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});