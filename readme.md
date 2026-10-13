# Learning TypeScript - School Dashboard

Project ini adalah aplikasi web sekolah berbasis TypeScript dan Express yang digunakan untuk belajar arsitektur backend yang rapi, autentikasi JWT, database PostgreSQL, serta CRUD data siswa.

## Fitur Utama

- Login admin dengan autentikasi JWT
- Middleware proteksi untuk route yang memerlukan login
- Dashboard admin dengan desain glassmorphism
- CRUD data siswa (create, read, update, delete)
- Validasi input di backend
- Password hashing menggunakan bcrypt
- PostgreSQL sebagai database utama
- Struktur project berbasis layering: route -> controller -> service -> repository

## Tech Stack

- Node.js
- TypeScript
- Express.js
- PostgreSQL
- PostgreSQL client (`pg`)
- JWT (`jsonwebtoken`)
- Password hashing (`bcrypt`)
- dotenv
- tsx

## Prasyarat

Pastikan perangkat Anda sudah memiliki:

- Node.js 18+
- npm
- PostgreSQL yang berjalan di lokal

## Instalasi

```bash
npm install
```

## Setup Environment

Buat file `.env` di root project dengan konfigurasi berikut:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_user
DB_PASSWORD=your_password
DB_NAME=your_database
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=1h
```

Contoh konfigurasi yang sudah dipakai dalam project:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=fishal
DB_PASSWORD=Qqf577nk99@123
DB_NAME=belajar_sql
JWT_SECRET=school-secret-key
JWT_EXPIRES_IN=1h
```

## Menjalankan Project

```bash
npm run dev
```

Setelah server berjalan, buka:

- http://localhost:3000/login
- http://localhost:3000/dashboard

## Default Login

Akun demo yang sudah dibuat otomatis oleh database:

- Username: `admin`
- Password: `admin123`

## API Endpoint

### Auth

- `POST /api/login`
- `POST /api/register`
- `POST /api/logout`

### User

- `GET /api/users`
- `GET /api/users/:id`
- `PUT /api/users/:id`
- `DELETE /api/users/:id`

### Student

- `GET /api/students`
- `POST /api/students`
- `PUT /api/students/:id`
- `DELETE /api/students/:id`

Semua endpoint siswa dan user management dilindungi dengan JWT.

## Struktur Project

```bash
.
├── public/
│   ├── css/
│   ├── js/
│   ├── dashboard.html
│   └── login.html
├── src/
│   ├── app.ts
│   ├── config/
│   ├── controllers/
│   ├── interfaces/
│   ├── middleware/
│   ├── models/
│   ├── repositories/
│   ├── routes/
│   ├── services/
│   └── types/
├── .env
├── .env.example
├── .gitignore
├── bug.md
├── package.json
├── readme.md
├── server.ts
├── tsconfig.json
└── static/
```

## Catatan Project

Project ini dibuat untuk kebutuhan pembelajaran dan eksperimen implementasi backend yang lebih nyata, dengan fokus pada:

- TypeScript strict typing
- clean architecture
- validasi input backend
- autentikasi JWT
- CRUD berbasis database relasional

## Penulis

- Fishal Maulana

---

Repository ini terus dikembangkan sebagai project belajar yang fokus pada aplikasi backend modern dengan TypeScript dan Express.

