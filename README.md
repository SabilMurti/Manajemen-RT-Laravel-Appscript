# Manajemen RT Laravel 12 (Setup Laravel Saja)

> README singkat untuk men-setup bagian Laravel (backend) tanpa konfigurasi Google Apps Script.  
> Pastikan kamu sudah meng-clone repositori dan memiliki file `composer.json` & `package.json` di dalamnya.

---

## Prasyarat

Sebelum memulai setup, pastikan di mesin kamu terpasang:

- **PHP ≥ 8.2**  
- **Composer ≥ 2.x**  
- **Node.js ≥ 16.x** & **npm ≥ 8.x** (atau **Yarn**)  
- **Git**  
- **MySQL / PostgreSQL / SQLite** (untuk tabel `users`, `roles`, dll.)

---

## Langkah‐Langkah Setup Laravel

1. ### Clone Repository  
   Pertama-tama, clone repositori ke lokal:
   ```bash
   git clone https://github.com/SabilMurti/Manajemen-RT-Laravel-Appscript.git
   cd <nama-repo>
   ```


2. ### Buat `​.env`   
   Copy file contoh `.env.example` menjadi `.env`:
   ```bash
   cp .env.example .env
   ```
   Lalu buka `.env` dan sesuaikan nilai‐nilai berikut minimal:
   ```dotenv
   APP_NAME="Manajemen RT"
   APP_ENV=local
   APP_KEY=
   APP_DEBUG=true
   APP_URL=http://localhost

   # Database: sesuaikan dengan pengaturan di mesin lokal
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=nama_database
   DB_USERNAME=root
   DB_PASSWORD=


3. ### Install Dependensi PHP (Composer)  
   Jalankan perintah berikut untuk mengunduh semua paket Laravel 12 dan dependensi lain:
   ```bash
   composer install
   ```
   - Jika ingin meng‐install tanpa paket pengembangan, gunakan:
     ```bash
     composer install --no-dev --optimize-autoloader
     ```

4. ### Generate APP_KEY  
   Setelah `composer install` selesai, generate key aplikasi:
   ```bash
   php artisan key:generate
   ```
   Perintah ini otomatis mengisi `APP_KEY` di file `.env` kamu.

5. ### Buat/Migrasi Database  
   Jika kamu ingin membuat tabel default Laravel (users, password_resets, dll.) plus tabel tambahan (misal roles/permissions), jalankan:
   ```bash
   php artisan migrate
   ```
   - Pastikan konfigurasi `DB_*` di file `.env` sudah benar dan database sudah dibuat di MySQL/PostgreSQL/SQLite.
   - Jika ada seeder (misalnya untuk user admin awal), jalankan:
     ```bash
     php artisan db:seed
     ```

6. ### Install Dependensi JavaScript (npm / Yarn)  
   Frontend Laravel (Inertia.js/React, Tailwind, Vite) membutuhkan paket‐paket NPM. Jalankan:
   ```bash
   npm install
   ```
   Atau jika kamu menggunakan Yarn:
   ```bash
   yarn install
   ```

7. ### Build Assets (Development / Production)  
   - **Development** (hot‐reload, watch mode):
     ```bash
     npm run dev
     ```
     Perintah ini menjalankan Vite dalam mode watch. Setiap kali kamu mengganti file `.tsx`/`.css`, browser akan merefresh otomatis.
   - **Production** (kompilasi “minified”, ready untuk deploy):
     ```bash
     npm run build
     ```
     Hasil build akan ditempatkan di `public/build` (atau folder output yang didefinisikan di `vite.config.js`).

8. ### Jalankan Server Laravel (Development)  
   Setelah langkah‐langkah di atas selesai, jalankan:
   ```bash
   php artisan serve
   ```
   Secara default, aplikasi akan berjalan di `http://127.0.0.1:8000`.  
   Buka browser ke alamat tersebut untuk melihat halaman awal.

9. ### (Opsional) Seeder Default & Roles  
   Jika repositori menyediakan seeder untuk membuat role (Admin RT, Ketua RT, Warga) atau user contoh, jalankan:
   ```bash
   php artisan db:seed
   ```
   Lihat file seeder di `database/seeders` untuk detail username/password default (jika ada).


## Ringkasan Perintah Penting

```bash
# 1. Clone repository
git clone https://github.com/<username-mu>/<nama-repo>.git
cd <nama-repo>

# 2. Copy .env
cp .env.example .env

# 3. Install paket PHP
composer install

# 4. Generate APP_KEY
php artisan key:generate

# 5. Migrasi database
php artisan migrate
php artisan db:seed   # (jika ada seeder)

# 6. Install paket JS
npm install   # atau yarn install

# 7. Build assets (development)
npm run dev

# 8. Jalankan server Laravel
php artisan serve

# 9. (Opsional) Build assets untuk produksi
npm run build
```

---

## Troubleshooting

- **`Allowed memory size exhausted` saat `composer install`**  
  - Edit `php.ini` agar `memory_limit` menjadi `-1` atau jalankan:
    ```bash
    php -d memory_limit=-1 $(which composer) install
    ```
- **Migrasi gagal karena tabel sudah ada**  
  Jika kamu sebelumnya pernah menjalankan migrasi dan sekarang ingin reset:
  ```bash
  php artisan migrate:refresh   # akan drop & migrate ulang
  ```
- **Port 8000 sudah terpakai**  
  Jalankan dengan port berbeda:
  ```bash
  php artisan serve --port=8080
  ```
  Lalu akses `http://127.0.0.1:8080`.

- **Error ESLint/Vite**  
  Pastikan Node.js dan npm versi sesuai (≥ 16.x & ≥ 8.x).  
  Jika masih error, hapus folder `node_modules/` dan file lock, lalu:
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  npm run dev
  ```

- **Warning “CRLF will be replaced by LF”**  
  Buat atau perbarui `.gitattributes` (lihat poin 10 di atas), lalu force‐refresh Git:
  ```bash
  git rm --cached -r .
  git reset --hard
  ```

---

## Lisensi

Project ini dilisensikan di bawah **MIT License**. Lihat file [`LICENSE`](LICENSE) untuk detail.
