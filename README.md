# Manajemen RT Laravel 12 



## Langkah‐Langkah Setup Laravel

1. ### Clone Repository  
   Pertama-tama, clone repositori ke lokal:
   ```bash
   git clone https://github.com/SabilMurti/Manajemen-RT-Laravel-Appscript.git
   cd Manajemen-RT-Laravel-Appscript
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
       

    GOOGLE_CLIENT_ID=...
    GOOGLE_CLIENT_SECRET=...
    
    RT_PROXY_KEY=...
    RT_PROXY_URL=...

   


3. ### Install Dependensi PHP (Composer)  
   
   ```bash
   composer install
   ```
  

4. ### Generate APP_KEY  
   Setelah `composer install` selesai, generate key aplikasi:
   ```bash
   php artisan key:generate
   ```
 
5. ### Buat/Migrasi Database  
 
   ```bash
   php artisan migrate
   ```
  

6. ### Install Dependensi JavaScript (npm / Yarn)  
   Frontend Laravel (Inertia.js/React, Tailwind, Vite) membutuhkan paket‐paket NPM. Jalankan:
   ```bash
   npm install
   ```
  
7. ### Start !! 
   - **Development** (hot‐reload, watch mode):
     ```bash
     composer run dev
     ```
   


