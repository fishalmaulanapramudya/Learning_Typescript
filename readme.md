# login_ts

Panduan singkat untuk mempersiapkan dan menjalankan proyek `login_ts` (TypeScript + Express).

**Prasyarat:**
- Node.js v18+ dan npm/yarn/pnpm terpasang
- Versi TypeScript dan dev-dependencies sudah ada di `package.json`

**Instalasi dependensi:**
```bash
npm install
# atau gunakan yarn/pnpm jika diinginkan
```

**Inisialisasi TypeScript (jika belum):**
```bash
npx tsc --init
```

Catatan: repositori ini sudah menyertakan `typescript` di `devDependencies`.

**Menjalankan pengembangan:**
```bash
npm run dev
```

Perintah `dev` menjalankan `tsx src/server.ts` sesuai `package.json`.

**Membangun untuk produksi:**
1. Transpile TypeScript ke JavaScript:
```bash
npx tsc
```
2. Jalankan hasil build (sesuaikan jalur output di `tsconfig.json`, contoh `dist`):
```bash
node dist/server.js
```

Jika ingin, tambahkan skrip `build` dan `start` ke `package.json`:
```json
"scripts": {
	"build": "tsc",
	"start": "node dist/server.js",
	"dev": "tsx src/server.ts"
}
```

**Variabel lingkungan (ENV):**
- `PORT` — port tempat server berjalan (default 3000)
- `JWT_SECRET` — secret untuk tanda tangan token JWT
- `DB_URL` — (opsional) URL database jika diperlukan

Contoh file `.env`:
```env
PORT=3000
JWT_SECRET=changeme_supersecret
# DB_URL=postgres://user:pass@localhost:5432/dbname
```

Catatan: proyek saat ini belum memasang `dotenv`. Jika ingin memuat `.env`, tambahkan `dotenv` dan panggil `require('dotenv').config()` pada titik masuk.

**Dependensi utama:**
- `express` — web framework
- `bcrypt` — hashing password
- `jsonwebtoken` — JWT untuk otentikasi

**Pengembangan & kontribusi:**
- Gunakan pull request kecil dan deskriptif.
- Tambahkan skrip `test` jika menambahkan tes.

**Kontak / Catatan:**
Jika butuh saya tambahkan skrip `build`/`start` otomatis atau konfigurasi `.env`/`dotenv`, beri tahu saya supaya saya perbarui `package.json` juga.


buat input password generator = npm install prompt-sync
npm install --save-dev @types/prompt-sync

