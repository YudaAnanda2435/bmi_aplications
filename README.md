# DietCare

DietCare adalah aplikasi web untuk klasifikasi status obesitas, rekomendasi pola diet awal, peringatan dini, laporan, riwayat klasifikasi, import Excel, dan cetak PDF laporan.

Sistem ini menggunakan model **Categorical Naive Bayes** untuk klasifikasi status obesitas dan **Rule-Based Recommendation / Forward Chaining** untuk rekomendasi pola diet. Hasil sistem bersifat informasi awal dan alat bantu, bukan diagnosis medis dan tidak menggantikan saran tenaga kesehatan.

## Konsep Sistem

DietCare sekarang menggunakan konsep akun pengguna terdaftar:

- Pengguna dapat register dan login.
- Tidak ada multi-role.
- Tidak ada role admin, masyarakat, superadmin, atau sejenisnya.
- Setiap data penduduk/resident dimiliki oleh akun pengguna yang membuatnya.
- User A tidak boleh melihat, mengubah, menghapus, mengklasifikasikan, atau mencetak data milik User B.

Penduduk tetap menjadi objek data yang dikelola di sistem. Penduduk tidak menjadi akun login terpisah.

## Fitur Utama

- Register pengguna.
- Login JWT.
- Dashboard ringkasan per pengguna.
- CRUD data penduduk.
- Import Excel data penduduk.
- Preview validasi import Excel.
- Klasifikasi massal dari Excel.
- Hitung BMI otomatis.
- Bentuk `BMI_Category` otomatis.
- Prediksi status obesitas dengan Naive Bayes.
- Rekomendasi pola diet berbasis aturan.
- Jadwal makan.
- Peringatan dini.
- Laporan klasifikasi terakhir.
- Riwayat klasifikasi.
- Detail laporan.
- Cetak PDF laporan.
- Logout.

## Metode

### Naive Bayes

Naive Bayes digunakan untuk menentukan `predicted_class`.

Output klasifikasi:

- `Underweight`
- `Normal`
- `Overweight`
- `Obesity`

Model final menggunakan fitur:

```text
Gender
Age
Height
Weight
BMI_Category
```

`BMI_Category` dibuat dari BMI:

| BMI | BMI_Category |
| --- | --- |
| BMI < 18.5 | BMI_Underweight |
| 18.5 <= BMI < 25 | BMI_Normal |
| 25 <= BMI < 30 | BMI_Overweight |
| BMI >= 30 | BMI_Obesity |

Catatan penting:

- Backend menghitung BMI otomatis.
- Frontend tidak meminta pengguna mengisi BMI manual.
- `BMI_Category` hanya menjadi fitur input model.
- Hasil akhir klasifikasi tetap berasal dari model Naive Bayes, bukan override rule BMI manual.

### Rule-Based Recommendation / Forward Chaining

Metode rule-based digunakan setelah hasil klasifikasi keluar. Output rekomendasi meliputi:

- `diet_pattern`
- `early_warning`
- `goal`
- `recommendation_summary`
- `main_recommendations`
- `meal_schedule`
- `additional_notes`
- `source_basis`
- `source_references`

Atribut yang dipakai untuk rekomendasi:

```text
family_history_with_overweight
FAVC
FCVC
NCP
CAEC
SMOKE
CH2O
SCC
FAF
TUE
CALC
MTRANS
```

## Struktur Project

```text
bmi_app/
|-- backend/
|   |-- app/
|   |-- migrations/
|   |-- ml_models/
|   |-- requirements.txt
|   |-- .env.example
|   `-- README.md
|-- frontend/
|   |-- src/
|   |-- package.json
|   |-- vite.config.js
|   `-- .env.example
|-- AGENTS.md
|-- README.md
|-- naive_bayes_obesity_model_final.pkl
`-- model_metadata_final.json
```

File model yang dipakai backend harus berada di:

```text
backend/ml_models/naive_bayes_obesity_model_final.pkl
backend/ml_models/model_metadata_final.json
```

File model di root hanya dianggap salinan/arsip.

## Kebutuhan

Backend:

- Python 3.10 atau lebih baru.
- MySQL atau XAMPP MySQL.
- FastAPI.
- SQLAlchemy.
- PyMySQL.
- scikit-learn `1.6.1`.
- pandas, numpy, joblib.
- openpyxl.
- reportlab.

Frontend:

- Node.js 18 atau lebih baru.
- npm.
- React.
- Vite.
- Tailwind CSS.
- Axios.
- React Router.

## Setup Database MySQL

Jalankan MySQL melalui XAMPP, lalu buat database:

```sql
CREATE DATABASE sinagar_dietcare CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Untuk XAMPP default, koneksi biasanya:

```env
DATABASE_URL=mysql+pymysql://root:@localhost:3306/sinagar_dietcare
```

## Setup Backend

Masuk ke folder backend:

```powershell
cd backend
```

Buat virtual environment:

```powershell
python -m venv venv
```

Install dependency:

```powershell
.\venv\Scripts\python.exe -m pip install -r requirements.txt
```

Salin `.env.example` menjadi `.env`:

```powershell
Copy-Item .env.example .env
```

Contoh `.env` development:

```env
APP_NAME=DietCare API
APP_ENV=development
DATABASE_URL=mysql+pymysql://root:@localhost:3306/sinagar_dietcare
SECRET_KEY=change-this-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
MODEL_PATH=ml_models/naive_bayes_obesity_model_final.pkl
MODEL_METADATA_PATH=ml_models/model_metadata_final.json
BACKEND_CORS_ORIGINS=http://localhost:5173,http://localhost:3000
DEFAULT_USER_NAME=Pengguna Development
DEFAULT_USER_EMAIL=user@dietcare.local
DEFAULT_USER_PASSWORD=user123
```

Jalankan backend:

```powershell
.\venv\Scripts\python.exe -m uvicorn app.main:app --reload
```

Buka Swagger:

```text
http://127.0.0.1:8000/docs
```

## Migration Database Lama

Jika database lama sudah pernah dibuat sebelum fitur register dan ownership data, backend akan mencoba menambahkan kolom dasar saat startup:

- `users.is_active`
- `residents.user_id`
- `classification_results.user_id`

Untuk menambahkan foreign key constraint dan backfill eksplisit, jalankan:

```text
backend/migrations/manual_user_auth_migration.sql
```

Jalankan file SQL tersebut di phpMyAdmin atau MySQL client pada database `sinagar_dietcare`.

## Setup Frontend

Masuk ke folder frontend:

```powershell
cd frontend
```

Install dependency:

```powershell
npm install
```

Buat file `.env` dari `.env.example`.

Isi minimal:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

Jalankan frontend:

```powershell
npm run dev
```

Buka:

```text
http://localhost:5173
```

Catatan: jika halaman register frontend belum tersedia, test registrasi pengguna melalui Swagger terlebih dahulu. Frontend perlu disesuaikan agar memiliki alur register sesuai endpoint `POST /api/auth/register`.

## Urutan Menjalankan Project

1. Jalankan MySQL XAMPP.
2. Pastikan database `sinagar_dietcare` sudah dibuat.
3. Jalankan backend.
4. Buka Swagger untuk test API.
5. Jalankan frontend.
6. Buka frontend di browser.

## Endpoint Backend Utama

Auth:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/token`
- `GET /api/auth/me`

Model:

- `GET /api/model/info`

Dashboard:

- `GET /api/dashboard/summary`

Residents:

- `GET /api/residents`
- `POST /api/residents`
- `GET /api/residents/{resident_id}`
- `PUT /api/residents/{resident_id}`
- `DELETE /api/residents/{resident_id}`

Import Excel:

- `GET /api/residents/import-template`
- `POST /api/residents/import-preview`
- `POST /api/residents/import-classify`

Prediction:

- `POST /api/predictions/predict`
- `POST /api/predictions/residents/{resident_id}`

Reports:

- `GET /api/reports`
- `GET /api/reports/latest`
- `GET /api/reports/history`
- `GET /api/reports/{classification_id}`
- `GET /api/reports/{classification_id}/pdf`

Semua endpoint data utama membutuhkan Bearer token.

## Testing via Swagger

Alur test dasar:

1. `GET /api/health`
2. `POST /api/auth/register`
3. `POST /api/auth/token` melalui tombol Authorize Swagger.
4. `GET /api/auth/me`
5. `GET /api/model/info`
6. `POST /api/residents`
7. `GET /api/residents`
8. `POST /api/predictions/residents/{resident_id}`
9. `GET /api/dashboard/summary`
10. `GET /api/reports/latest`
11. `GET /api/reports/history`
12. `GET /api/reports/{classification_id}`
13. `GET /api/reports/{classification_id}/pdf`

Test ownership:

1. Register User A.
2. Register User B.
3. Login sebagai User A.
4. Tambah resident User A dan klasifikasikan.
5. Catat `resident_id` dan `classification_id`.
6. Login sebagai User B.
7. Pastikan `GET /api/residents` tidak menampilkan data User A.
8. Pastikan akses `GET /api/residents/{resident_id}` milik User A ditolak.
9. Pastikan akses report/PDF milik User A memakai token User B ditolak.

## Import Excel

Import Excel digunakan untuk input data penduduk dan klasifikasi massal, bukan untuk training model.

Template dapat diunduh dari:

```text
GET /api/residents/import-template
```

Sheet template:

- `Input_Penduduk`
- `Panduan_Pengisian`
- `Kode_Sistem`
- `resident_import`

Backend membaca `Input_Penduduk` sebagai format utama. Jika sheet tersebut tidak ada, backend fallback ke header teknis lama.

BMI tidak perlu diisi di Excel. Backend menghitung BMI otomatis dari tinggi dan berat badan.

## Input Tinggi dan Berat

Tinggi badan boleh dikirim dalam meter atau sentimeter:

- `1.6` dianggap meter.
- `160` dianggap sentimeter dan dinormalisasi menjadi `1.6`.

Rumus BMI:

```text
BMI = Weight / (Height ** 2)
```

Contoh:

```text
Height = 160
Weight = 105
BMI = 41.02
```

## Output Prediksi

Response prediksi dapat berisi:

- `predicted_class`
- `bmi`
- `bmi_category`
- `model_version`
- `probabilities`
- `diet_pattern`
- `early_warning`
- `goal`
- `recommendation_summary`
- `main_recommendations`
- `meal_schedule`
- `additional_notes`
- `method`
- `source_basis`
- `source_references`
- `recommendation`

## Build

Backend compile check:

```powershell
cd backend
.\venv\Scripts\python.exe -m compileall app
```

Frontend build:

```powershell
cd frontend
npm run build
```

Preview frontend build:

```powershell
npm run preview
```

## Troubleshooting

### Login gagal

- Pastikan user sudah register.
- Jika memakai user default development, cek `DEFAULT_USER_EMAIL` dan `DEFAULT_USER_PASSWORD`.
- Jika password di `.env` diganti setelah user sudah ada di database, hapus user lama atau ubah password hash di database.

### Database tidak konek

- Pastikan MySQL XAMPP berjalan.
- Pastikan database `sinagar_dietcare` sudah dibuat.
- Cek `DATABASE_URL`.

### Swagger Authorize gagal

- Gunakan endpoint OAuth `POST /api/auth/token`.
- Field `username` di Swagger diisi email user.
- Field `password` diisi password user.

### Data user lain terlihat

- Pastikan backend sudah memakai versi terbaru.
- Jalankan migration/startup agar `residents.user_id` dan `classification_results.user_id` terisi.
- Test ulang dengan token user berbeda.

### Model tidak ditemukan

Pastikan file ini ada:

```text
backend/ml_models/naive_bayes_obesity_model_final.pkl
backend/ml_models/model_metadata_final.json
```

### Frontend tidak tersambung backend

- Pastikan backend berjalan di `http://127.0.0.1:8000`.
- Pastikan `frontend/.env` berisi `VITE_API_BASE_URL=http://127.0.0.1:8000`.
- Pastikan `BACKEND_CORS_ORIGINS` mencakup `http://localhost:5173`.

## Catatan Penting

- Jangan commit `.env`.
- Jangan menghapus `backend/ml_models/`.
- Jangan mengganti model tanpa menyesuaikan metadata.
- Jangan meminta pengguna mengisi BMI manual.
- Jangan menjadikan BMI sebagai override final class.
- Jangan menambah fitur diagnosis medis, resep, konsultasi dokter, payment, marketplace, subscription, atau multi-role.
- Semua hasil sistem harus dipahami sebagai informasi awal dan alat bantu.

## Referensi Internal

Panduan backend lebih detail:

```text
backend/README.md
```

Panduan testing Swagger jika tersedia:

```text
backend/SWAGGER_TESTING.md
```
