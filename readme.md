# Learning TypeScript

Project ini dibuat sebagai media belajar saya untuk memahami dan mempraktikkan TypeScript secara lebih serius, khususnya dalam pembuatan aplikasi backend dengan Express.

## Tujuan Project

Repository ini saya gunakan untuk belajar:

- dasar-dasar TypeScript
- penulisan tipe data dan interface
- struktur project yang rapi
- Express.js dengan TypeScript
- autentikasi dan manajemen user
- pengelolaan konfigurasi environment
- koneksi ke database PostgreSQL

## Deskripsi

Project ini merupakan aplikasi sederhana berbasis backend yang berfokus pada proses login, user management, dan penerapan konsep TypeScript dalam aplikasi nyata. Project ini masih dalam tahap pembelajaran dan pengembangan, sehingga struktur dan fungsinya terus disempurnakan sesuai pemahaman yang berkembang.

## Tech Stack

- Node.js
- TypeScript
- Express
- PostgreSQL
- bcrypt / argon2
- JWT
- dotenv
- tsx

## Prasyarat

Pastikan perangkat Anda sudah memiliki:

- Node.js 18+
- npm
- PostgreSQL (jika fitur database digunakan)

## Instalasi

```bash
npm install
```

## Menjalankan Project

```bash
npm run dev
```

## Environment

Buat file `.env` dengan konfigurasi seperti berikut:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_user
DB_PASSWORD=your_password
DB_NAME=your_database
JWT_SECRET=your_secret_key
```

## Struktur Project

```bash
.
├── public/
├── src/
│   ├── app.ts
│   ├── config/
│   ├── controllers/
│   ├── interfaces/
│   ├── models/
│   ├── repositories/
│   ├── routes/
│   ├── services/
│   └── types/
├── .env.example
├── .gitignore
├── bug.md
├── package.json
├── readme.md
├── server.ts
├── tsconfig.json
└── static/
```

## Catatan

Project ini bukan project komersial, melainkan project pembelajaran personal saya untuk memahami TypeScript secara praktis. Saya akan terus menambah fitur, memperbaiki struktur, dan meningkatkan kualitas aplikasi seiring bertambahnya pemahaman.

## Roadmap Belajar

- memahami type system TypeScript
- membuat API dengan Express + TypeScript
- membangun autentikasi user
- menambahkan validasi dan error handling
- mengintegrasikan database
- menambahkan testing dan deployment

## Penulis

- Fishal Maulana

---

Repository ini dibuat untuk proses belajar dan eksplorasi TypeScript secara nyata dalam sebuah aplikasi backend.

