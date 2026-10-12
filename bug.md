# Bug yang ditemukan

## 1. Login gagal karena nama field tidak sesuai

- Masalah: pada form login di `public/login.html`, input username menggunakan `name="name"`.
- Akibat: di controller, server membaca `const { username, password } = req.body;`.
- Karena `req.body.username` bernilai `undefined`, logika login selalu gagal bahkan saat username benar.
- Perbaikan: ubah input menjadi `name="username"` agar body request sesuai dengan kode backend.

## 2. Data user baru tidak dikembalikan dengan benar

- Masalah: di `src/repositories/UserRepository.ts`, method `create()` mengembalikan `result.row[0]`.
- Akibat: `row` tidak ada pada objek hasil query PostgreSQL, sehingga data user yang baru dibuat tidak dikembalikan dengan benar.
- Perbaikan: gunakan `result.rows[0]`.

## 3. Konfigurasi TypeScript tidak sesuai dengan modul ESM

- Masalah: `package.json` tidak menandai proyek sebagai module ES, sementara file TypeScript menggunakan import ES dan `module: NodeNext`.
- Akibat: kompilasi `tsc --noEmit` gagal dan aplikasi tidak bisa dijalankan dengan konfigurasi NodeNext yang benar.
- Perbaikan: menambahkan `"type": "module"`, mengaktifkan `moduleResolution: "NodeNext"`, serta menyesuaikan path import ke `.js` agar kompatibel dengan transpiler.

## Status

- Bug login telah diperbaiki.
- Bug create user juga telah diperbaiki.
- Konfigurasi TypeScript yang menyebabkan error build juga telah diperbaiki.
