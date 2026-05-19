# Sinagar DietCare

Sinagar DietCare adalah web application internal berbasis admin untuk mengelola data penduduk Kampung Sinagar, menjalankan klasifikasi status obesitas menggunakan model Naive Bayes, menampilkan rekomendasi pola diet berbasis Rule-Based Recommendation / Forward Chaining, memberikan peringatan dini, serta menyediakan laporan dan riwayat klasifikasi.

Project ini dibuat untuk kebutuhan akademik/skripsi. Sistem ditujukan untuk admin, peneliti, atau petugas pendataan, bukan untuk akses publik oleh penduduk.

## Deskripsi Singkat

Sinagar DietCare membantu admin melakukan pendataan penduduk, menghitung BMI secara otomatis dari tinggi dan berat badan, menjalankan klasifikasi status obesitas, menampilkan rekomendasi pola diet, memberikan peringatan dini, dan menyusun laporan hasil klasifikasi.

Sistem ini juga mendukung import data penduduk dari Excel, klasifikasi massal, halaman laporan hasil klasifikasi terakhir per penduduk, riwayat klasifikasi, dan cetak PDF detail laporan.

## Tujuan Sistem

Tujuan utama Sinagar DietCare adalah:

- Mengelola data penduduk Kampung Sinagar.
- Menghitung BMI secara otomatis dari tinggi dan berat badan.
- Mengklasifikasikan status obesitas penduduk.
- Memberikan rekomendasi pola diet sebagai informasi awal.
- Memberikan peringatan dini berdasarkan hasil klasifikasi.
- Menampilkan laporan klasifikasi terakhir setiap penduduk.
- Menampilkan riwayat seluruh proses klasifikasi.
- Mendukung import Excel untuk data penduduk.
- Mendukung klasifikasi massal dari data Excel.
- Mendukung cetak PDF detail laporan.

## Catatan Penting Non-Medis

Sistem ini hanya memberikan informasi awal dan alat bantu. Sistem tidak menggantikan diagnosis, saran dokter, ahli gizi, atau tenaga kesehatan.

Hasil klasifikasi, rekomendasi pola diet, jadwal makan, dan peringatan dini yang tampil di sistem harus dipahami sebagai keluaran sistem berbasis data, bukan keputusan medis final.

## Fitur Utama

- Login admin.
- Dashboard ringkasan sistem.
- Manajemen data penduduk.
- Tambah data penduduk.
- Edit data penduduk.
- Hapus data penduduk.
- Detail data penduduk.
- Klasifikasi status obesitas.
- Rekomendasi pola diet.
- Jadwal makan.
- Peringatan dini.
- Laporan klasifikasi terakhir per penduduk.
- Riwayat klasifikasi.
- Import Excel data penduduk.
- Klasifikasi massal.
- Download template Excel.
- Cetak PDF detail laporan.
- Landing page.
- Toast notification.
- Loading modal.
- Skeleton loading.
- UX improvement untuk aksi penting dan halaman data.

## Metode yang Digunakan

### Naive Bayes

Naive Bayes digunakan untuk melakukan klasifikasi status obesitas. Model diproses di backend melalui service machine learning dan memakai model final:

```text
backend/ml_models/naive_bayes_obesity_model_final.pkl
backend/ml_models/model_metadata_final.json
```

Output klasifikasi utama:

- Underweight
- Normal
- Overweight
- Obesity

### Rule-Based Recommendation / Forward Chaining

Rule-Based Recommendation / Forward Chaining digunakan untuk menyusun rekomendasi pola diet, jadwal makan, dan peringatan dini berdasarkan hasil klasifikasi serta beberapa atribut input penduduk.

Dasar rekomendasi mengacu pada:

- Kemenkes - Isi Piringku / Pedoman Gizi Seimbang.
- WHO - Healthy Diet.
- NHS - Healthy Ways to Gain Weight.
- AHA/ACC/TOS Guideline - Management of Overweight and Obesity.

### BMI Otomatis

BMI dihitung otomatis oleh backend dari tinggi dan berat badan. Admin tidak perlu dan tidak boleh mengisi BMI secara manual.

Rumus umum:

```text
BMI = Weight / (Height ^ 2)
```

Height digunakan dalam satuan meter pada proses backend. Jika input dari UI atau Excel berupa cm, sistem melakukan normalisasi agar sesuai dengan kebutuhan perhitungan.

## Output Sistem

Output klasifikasi:

- Underweight
- Normal
- Overweight
- Obesity

Output tambahan:

- Pola diet.
- Rekomendasi utama.
- Jadwal makan.
- Peringatan dini.
- Probabilitas klasifikasi.
- Dasar rekomendasi.
- Catatan sistem.

## Struktur Folder Project

```text
bmi_app/
|-- AGENTS.md
|-- README.md
|-- backend/
|   |-- AGENTS.md
|   |-- app/
|   |   |-- api/
|   |   |-- core/
|   |   |-- db/
|   |   |-- models/
|   |   |-- schemas/
|   |   |-- services/
|   |   `-- utils/
|   |-- ml_models/
|   |-- requirements.txt
|   |-- .env.example
|   `-- ...
`-- frontend/
    |-- AGENTS.md
    |-- src/
    |   |-- components/
    |   |-- constants/
    |   |-- context/
    |   |-- hooks/
    |   |-- layouts/
    |   |-- pages/
    |   |-- routes/
    |   |-- services/
    |   `-- utils/
    |-- package.json
    |-- .env.example
    `-- ...
```

## Persyaratan Sistem

Pastikan perangkat sudah memiliki:

- Python 3.10 atau lebih baru.
- Node.js 18 atau lebih baru.
- npm.
- MySQL.
- XAMPP.
- Browser modern, misalnya Chrome, Edge, atau Firefox.
- Git, opsional untuk clone repository.

## Setup Database MySQL

1. Buka XAMPP Control Panel.
2. Start `Apache` dan `MySQL`.
3. Buka phpMyAdmin:

```text
http://localhost/phpmyadmin
```

4. Buat database baru dengan SQL berikut:

```sql
CREATE DATABASE sinagar_dietcare CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Database ini akan dipakai oleh backend FastAPI melalui SQLAlchemy.

## Setup Backend

Masuk ke folder backend:

```bash
cd backend
```

Buat virtual environment:

```bash
python -m venv venv
```

Aktifkan virtual environment di Windows:

```bash
.\venv\Scripts\activate
```

Install dependency:

```bash
pip install -r requirements.txt
```

Dependency PDF dan Excel idealnya sudah tersedia di `requirements.txt`. Jika tetap muncul error module, install manual:

```bash
pip install reportlab
pip install openpyxl pandas
```

## Konfigurasi .env Backend

File `backend/.env.example` adalah template. Salin menjadi `backend/.env`, lalu sesuaikan nilainya untuk komputer lokal.

Contoh `.env` backend:

```env
APP_NAME=Sinagar DietCare API
APP_ENV=development

DATABASE_URL=mysql+pymysql://root:@localhost:3306/sinagar_dietcare

SECRET_KEY=skripsi-sinagar-dietcare-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

MODEL_PATH=ml_models/naive_bayes_obesity_model_final.pkl
MODEL_METADATA_PATH=ml_models/model_metadata_final.json

BACKEND_CORS_ORIGINS=http://localhost:5173,http://localhost:3000

DEFAULT_ADMIN_NAME=Administrator
DEFAULT_ADMIN_EMAIL=admin@sinagar.local
DEFAULT_ADMIN_PASSWORD=admin123
```

Keterangan:

- `DATABASE_URL` di atas cocok untuk XAMPP default dengan user `root` tanpa password.
- `DEFAULT_ADMIN_PASSWORD` adalah password login aplikasi, bukan password MySQL.
- `SECRET_KEY` sebaiknya diganti untuk environment production.
- Jangan commit file `.env` jika project memakai Git.

## Menjalankan Backend

Pastikan virtual environment aktif dan posisi terminal berada di folder `backend`.

Jalankan backend:

```bash
python -m uvicorn app.main:app --reload
```

Atau jika ingin langsung memakai Python dari venv Windows:

```bash
.\venv\Scripts\python.exe -m uvicorn app.main:app --reload
```

URL backend:

- API: `http://127.0.0.1:8000`
- Swagger: `http://127.0.0.1:8000/docs`

Saat backend berjalan, aplikasi akan melakukan inisialisasi database dan membuat admin default jika environment development mengaktifkan konfigurasi admin default.

## Login Admin Default

Akun demo development:

```text
Email: admin@sinagar.local
Password: admin123
```

Admin default dibuat saat `APP_ENV=development`, `DEFAULT_ADMIN_EMAIL` dan `DEFAULT_ADMIN_PASSWORD` tersedia, dan user admin belum ada di database.

Jika admin sudah pernah dibuat dengan password lama, ubah password di database atau hapus user admin tersebut lalu restart backend agar admin default dibuat ulang.

## Setup Frontend

Masuk ke folder frontend:

```bash
cd frontend
```

Install dependency:

```bash
npm install
```

## Konfigurasi .env Frontend

Buat file `frontend/.env` berdasarkan `frontend/.env.example`.

Isi minimal:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

Pastikan URL tersebut sama dengan backend yang sedang berjalan.

## Menjalankan Frontend

Jalankan frontend:

```bash
npm run dev
```

URL default Vite:

```text
http://localhost:5173
```

Buka URL tersebut di browser, lalu masuk menggunakan akun admin development.

## Alur Menjalankan Project dari Awal

1. Jalankan XAMPP.
2. Start MySQL.
3. Buat database `sinagar_dietcare`.
4. Masuk folder `backend`.
5. Buat dan aktifkan virtual environment.
6. Install dependency backend.
7. Buat file `backend/.env`.
8. Jalankan backend dengan Uvicorn.
9. Buka Swagger untuk memastikan API aktif.
10. Masuk folder `frontend`.
11. Install dependency frontend.
12. Buat file `frontend/.env`.
13. Jalankan frontend dengan Vite.
14. Login sebagai admin.
15. Input data penduduk atau import Excel.
16. Jalankan klasifikasi.
17. Lihat laporan dan riwayat klasifikasi.
18. Cetak PDF detail laporan jika diperlukan.

## Endpoint Backend Utama

Sebagian besar endpoint selain login memerlukan Bearer token.

### Auth

- `POST /api/auth/login`
- `POST /api/auth/token`

### Model

- `GET /api/model/info`

### Dashboard

- `GET /api/dashboard/summary`

### Residents

- `GET /api/residents`
- `POST /api/residents`
- `GET /api/residents/{resident_id}`
- `PUT /api/residents/{resident_id}`
- `DELETE /api/residents/{resident_id}`

### Prediction

- `POST /api/predictions/predict`
- `POST /api/predictions/residents/{resident_id}`

### Reports

- `GET /api/reports/latest`
- `GET /api/reports/history`
- `GET /api/reports/{classification_id}`
- `GET /api/reports/{classification_id}/pdf`

### Import Excel

- `GET /api/residents/import-template`
- `POST /api/residents/import-preview`
- `POST /api/residents/import-classify`

## Penjelasan Import Excel

Fitur import Excel dibuat untuk mempercepat input data penduduk dan mendukung klasifikasi massal.

Alur import Excel:

1. Admin klik `Download Template`.
2. Sistem mengunduh template Excel resmi.
3. Petugas mengisi sheet `Input_Penduduk`.
4. Admin upload file `.xlsx`.
5. Sistem melakukan preview dan validasi data.
6. Data valid bisa disimpan dan diklasifikasikan massal.
7. Hasil import masuk ke Data Penduduk.
8. Hasil klasifikasi masuk ke Laporan dan Riwayat Klasifikasi.

Catatan:

- BMI tidak perlu diisi.
- Jangan mengubah nama kolom template.
- Gunakan pilihan data sesuai template agar validasi backend berhasil.
- Import ini bukan upload dataset training dan tidak melakukan retraining model.

## Struktur Kolom Excel

Kolom template Excel:

- Nama Penduduk
- Jenis Kelamin
- Usia
- Tinggi Badan (cm)
- Berat Badan (kg)
- Riwayat Keluarga Obesitas
- Konsumsi Makanan Tinggi Kalori / Fast Food
- Frekuensi Konsumsi Sayur
- Jumlah Makan Utama
- Kebiasaan Makan di Antara Waktu Makan
- Merokok
- Konsumsi Air Harian
- Kebiasaan Mengontrol Kalori
- Frekuensi Aktivitas Fisik
- Durasi Penggunaan Perangkat Teknologi
- Konsumsi Alkohol
- Jenis Transportasi Harian

## Penjelasan Field Data Penduduk

| Field | Keterangan | Contoh input |
| --- | --- | --- |
| Nama Penduduk | Nama penduduk yang didata | Adit |
| Jenis Kelamin | Jenis kelamin penduduk | Laki-laki / Perempuan |
| Usia | Usia dalam tahun | 28 |
| Tinggi Badan | Tinggi badan, umumnya diisi dalam cm di UI/Excel | 165 |
| Berat Badan | Berat badan dalam kg | 60 |
| Riwayat Keluarga Obesitas | Ada atau tidak riwayat keluarga dengan overweight/obesitas | Ya / Tidak |
| Konsumsi Fast Food | Kebiasaan konsumsi makanan tinggi kalori atau fast food | Ya / Tidak |
| Frekuensi Konsumsi Sayur | Tingkat kebiasaan konsumsi sayur | Jarang / Kadang-kadang / Sering |
| Jumlah Makan Utama | Jumlah makan utama yang biasa dilakukan | 1 kali / 2 kali / 3 kali / Lebih dari 3 kali |
| Makanan di Antara Waktu Makan | Kebiasaan makan di antara waktu makan utama | Tidak / Kadang-kadang / Sering / Selalu |
| Merokok | Status kebiasaan merokok | Ya / Tidak |
| Konsumsi Air Harian | Tingkat konsumsi air harian | Rendah / Sedang / Tinggi |
| Mengontrol Kalori | Kebiasaan mengontrol kalori | Ya / Tidak |
| Aktivitas Fisik | Tingkat kebiasaan aktivitas fisik | Tidak pernah / Rendah / Sedang / Tinggi |
| Penggunaan Teknologi | Tingkat durasi penggunaan perangkat teknologi | Rendah / Sedang / Tinggi |
| Konsumsi Alkohol | Kebiasaan konsumsi alkohol | Tidak / Kadang-kadang / Sering / Selalu |
| Jenis Transportasi | Transportasi harian | Mobil / Motor / Sepeda / Transportasi Umum / Jalan Kaki |

Nama field API tetap mengikuti kebutuhan backend dan model, misalnya `gender`, `age`, `height`, `weight`, `fcvc`, `ncp`, `ch2o`, `faf`, `tue`, dan field lain yang dipakai model.

## Laporan dan Riwayat Klasifikasi

Ada dua halaman utama untuk hasil klasifikasi:

### Laporan Klasifikasi

Laporan menampilkan hasil klasifikasi terakhir dari setiap penduduk. Jika satu penduduk diklasifikasi berkali-kali, yang tampil di halaman Laporan hanya hasil terbaru.

Tujuannya agar admin bisa melihat ringkasan kondisi terakhir setiap penduduk tanpa duplikasi.

### Riwayat Klasifikasi

Riwayat Klasifikasi menampilkan semua proses klasifikasi yang pernah dilakukan. Jika satu penduduk diklasifikasi lima kali, maka riwayat akan menampilkan lima baris untuk penduduk tersebut.

Tujuannya agar admin bisa melihat perjalanan atau catatan proses klasifikasi dari waktu ke waktu.

## Cetak PDF Laporan

Detail laporan memiliki tombol `Cetak PDF`.

Ketika tombol ditekan:

1. Frontend memanggil endpoint backend.
2. Backend mengambil data detail laporan berdasarkan `classification_id`.
3. Backend membuat PDF menggunakan ReportLab.
4. File PDF dikirim ke browser untuk diunduh.

PDF laporan memuat:

- Header laporan.
- Identitas penduduk.
- Hasil klasifikasi.
- BMI.
- Pola diet.
- Tujuan rekomendasi.
- Rekomendasi utama.
- Jadwal makan.
- Probabilitas klasifikasi.
- Catatan sistem.
- Metode rekomendasi.
- Dasar rekomendasi.
- Footer catatan non-medis.
- Nomor halaman.

PDF dibuat di backend dan mendukung multipage, sehingga konten panjang dapat lanjut ke halaman berikutnya.

## Troubleshooting

### A. ModuleNotFoundError: No module named 'reportlab'

Solusi:

```bash
pip install reportlab
```

Idealnya dependency ini sudah terpasang melalui:

```bash
pip install -r requirements.txt
```

### B. MySQL tidak terkoneksi

Solusi:

- Pastikan MySQL XAMPP berjalan.
- Pastikan database `sinagar_dietcare` sudah dibuat.
- Cek `DATABASE_URL` pada `backend/.env`.
- Jika MySQL memakai password, sesuaikan URL, misalnya:

```env
DATABASE_URL=mysql+pymysql://root:password@localhost:3306/sinagar_dietcare
```

### C. Login gagal

Solusi:

- Cek `DEFAULT_ADMIN_EMAIL` dan `DEFAULT_ADMIN_PASSWORD`.
- Pastikan backend sudah direstart setelah mengubah `.env`.
- Jika admin sudah dibuat dengan password lama, hapus user admin di database lalu restart backend.

### D. 401 Not authenticated

Solusi:

- Login terlebih dahulu dari frontend.
- Jika memakai Swagger, klik tombol `Authorize`.
- Masukkan token Bearer yang didapat dari login.
- Pastikan request mengirim header:

```text
Authorization: Bearer <token>
```

### E. BMI menjadi 0 atau tidak sesuai

Solusi:

- Pastikan tinggi badan valid.
- Jika input tinggi badan dalam cm, sistem harus menormalisasi ke meter.
- Contoh: `160 cm` menjadi `1.60 m`.
- Pastikan berat badan lebih dari 0.

### F. Frontend tidak bisa konek API

Solusi:

- Pastikan backend berjalan di `http://127.0.0.1:8000`.
- Cek `frontend/.env`.
- Pastikan isinya:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

- Cek konfigurasi CORS backend:

```env
BACKEND_CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

### G. Import Excel gagal

Solusi:

- Gunakan template resmi dari sistem.
- Isi sheet `Input_Penduduk`.
- Jangan ubah nama kolom.
- Pastikan file berformat `.xlsx`.
- Cek value dropdown pada template.
- Jalankan preview terlebih dahulu untuk melihat data valid dan data bermasalah.

## Build Production

### Backend

Backend dapat dijalankan dengan Uvicorn:

```bash
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```

Untuk production, gunakan konfigurasi server ASGI yang sesuai environment. Pastikan juga mengganti `SECRET_KEY`, memakai database production, dan mengatur CORS dengan origin yang benar.

### Frontend

Build frontend:

```bash
npm run build
```

Preview hasil build:

```bash
npm run preview
```

Folder hasil build berada di:

```text
frontend/dist
```

## Testing Manual

Checklist pengujian manual:

- Backend running.
- Swagger terbuka.
- Login berhasil.
- Token tersimpan.
- Dashboard tampil.
- Data penduduk tampil.
- Tambah data berhasil.
- Edit data berhasil.
- Hapus data berhasil.
- Detail penduduk tampil.
- Klasifikasi berhasil.
- Rekomendasi diet tampil.
- Jadwal makan tampil.
- Sumber rekomendasi tampil.
- Import Excel preview berhasil.
- Import dan klasifikasi massal berhasil.
- Laporan latest tampil.
- Riwayat klasifikasi tampil.
- Detail laporan tampil.
- Cetak PDF berhasil.
- Frontend build berhasil.

## Akun Demo

Akun admin development:

```text
Email: admin@sinagar.local
Password: admin123
```

Jika akun tersebut tidak bisa digunakan, cek konfigurasi `.env` backend dan data pada tabel `users`.

## Catatan Development

- Jangan commit `.env` jika memakai Git.
- Gunakan `.env.example` sebagai template konfigurasi.
- Jangan mengubah model `.pkl` tanpa proses training ulang yang jelas.
- Jangan menghapus field model karena backend dan frontend bergantung pada model final.
- Jangan meminta admin mengisi BMI manual.
- Jangan menambahkan fitur di luar scope skripsi seperti registrasi publik, konsultasi dokter, payment, marketplace, atau fitur diet komersial.
- Jika mengubah endpoint backend, pastikan service frontend ikut diperbarui.
- Jika mengubah struktur response, pastikan halaman hasil klasifikasi dan laporan tetap memiliki fallback untuk data lama.

## Lisensi dan Catatan Akademik

Project Sinagar DietCare dibuat untuk kebutuhan akademik/skripsi. Penggunaan, pengembangan, atau publikasi ulang project mengikuti kebutuhan akademik dan ketentuan pemilik project.

Sistem ini ditujukan sebagai alat bantu pengelolaan data, klasifikasi status obesitas, rekomendasi pola diet awal, dan peringatan dini dalam konteks studi kasus Kampung Sinagar.
