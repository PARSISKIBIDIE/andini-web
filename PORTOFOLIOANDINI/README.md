# Setup Backend Portfolio Andini

Backend untuk portfolio Andini Aulia Syahrani sudah dibuat menggunakan Node.js + Express + SQLite.

## 📋 File-File Yang Dibuat

1. **server.js** - Server Express dengan API endpoints
2. **messages.html** - Halaman untuk melihat daftar pesan (mirip desain halaman lain)
3. **admin.css** - Styling untuk halaman messages
4. **admin.js** - JavaScript untuk mengelola pesan (view, delete)
5. **package.json** - Dependencies management
6. **messages.db** - Database SQLite (dibuat otomatis saat server pertama kali dijalankan)

## 🚀 Cara Setup & Run

### 1. Install Node.js
Jika belum punya Node.js, download dari: https://nodejs.org/

### 2. Install Dependencies
Buka terminal di folder project dan jalankan:
```bash
npm install
```

### 3. Jalankan Server
```bash
npm start
```

Server akan berjalan di: **http://localhost:3000**

### Untuk Development Mode (dengan auto-reload):
```bash
npm run dev
```
(Memerlukan nodemon terlebih dahulu: `npm install --save-dev nodemon`)

## 📱 Cara Menggunakan

### 1. **Halaman Utama** - http://localhost:3000
   - Pengunjung bisa mengisi form kontak dengan nama dan pesan
   - Pesan akan langsung tersimpan di database

### 2. **Halaman Pesan** - http://localhost:3000/messages
   - Lihat semua pesan yang masuk dalam bentuk tabel
   - Klik tombol "Lihat" untuk detail lengkap pesan
   - Klik tombol "Hapus" untuk menghapus pesan
   - Halaman auto-refresh setiap 5 detik untuk data terbaru

## 🔌 API Endpoints

### Kirim Pesan Baru
```
POST /api/messages
Content-Type: application/json

{
  "nama": "Nama Pengirim",
  "pesan": "Isi pesan"
}
```

### Dapatkan Semua Pesan
```
GET /api/messages
```

### Dapatkan Pesan Spesifik
```
GET /api/messages/:id
```

### Hapus Pesan
```
DELETE /api/messages/:id
```

## 🎨 Desain Halaman Messages

Halaman pesan memiliki desain yang:
- ✨ Mirip dengan halaman utama (warna gradient yang sama)
- 🎀 Menggunakan tema cute dengan emoji
- 📱 Responsive untuk mobile
- ✅ Tabel interaktif dengan hover effects

## ⚙️ Troubleshooting

**Error: Port 3000 sudah digunakan?**
- Ubah PORT di server.js menjadi port lain (misal 3001)

**Database tidak muncul?**
- Cek folder project, file `messages.db` akan otomatis dibuat

**Form tidak terkirim?**
- Pastikan server sedang berjalan
- Buka DevTools (F12) untuk lihat error di console

## 📌 Catatan

- Semua pesan disimpan di `messages.db` (SQLite file)
- Database akan persist meski server di-restart
- Design responsif cocok untuk desktop dan mobile
- Emoji di halaman membuat tampilan lebih cute dan sesuai tema orignal 🌸
