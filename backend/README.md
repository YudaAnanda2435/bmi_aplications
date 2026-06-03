# DietCare API

Backend FastAPI untuk DietCare. Sistem ini menghitung BMI, menjalankan klasifikasi status obesitas menggunakan model final Categorical Naive Bayes, lalu menampilkan rekomendasi pola diet dan peringatan dini sebagai informasi awal. Pada penelitian ini, implementasi sistem memakai studi kasus masyarakat Kampung Sinagar.

Sistem ini bukan diagnosis medis dan tidak menggantikan saran tenaga kesehatan.

## Scope

Fitur backend:

- Admin login dengan JWT.
- CRUD data penduduk/resident.
- Import data penduduk dari Excel.
- Hitung BMI otomatis dari tinggi dan berat badan.
- Prediksi status obesitas dengan model final.
- Klasifikasi massal dari data Excel.
- Simpan hasil klasifikasi resident.
- Dashboard ringkas.
- Report/list riwayat klasifikasi.

Tidak ada fitur di luar scope skripsi seperti konsultasi dokter, diagnosis medis pasti, resep/obat, marketplace, payment, registrasi publik, subscription, atau manajemen rumah sakit.

## Model Final

Backend memakai model final:

```text
ml_models/naive_bayes_obesity_model_final.pkl
```

Metadata model:

```text
ml_models/model_metadata_final.json
```

Fitur model tetap:

```text
Gender, Age, Height, Weight, BMI_Category
```

Backend tetap menghitung BMI otomatis, lalu membuat `BMI_Category` sebagai fitur input model final. Hasil klasifikasi tetap ditentukan oleh model Naive Bayes, bukan rule BMI manual. Field pola makan dan aktivitas tetap disimpan dan dipakai untuk rekomendasi rule-based/forward chaining.

## Install

Dari folder `backend`:

```powershell
python -m venv venv
.\venv\Scripts\python.exe -m pip install -r requirements.txt
```

Daftar dependency yang akan di-install dari `requirements.txt`:

```text
fastapi
uvicorn[standard]
pydantic-settings
python-dotenv
sqlalchemy
pymysql
python-jose[cryptography]
passlib[bcrypt]
bcrypt
joblib
pandas
numpy
scikit-learn==1.6.1
python-multipart
openpyxl
reportlab
```

## Setup MySQL

Buka XAMPP Control Panel, lalu jalankan service MySQL.

Buat database:

```sql
CREATE DATABASE sinagar_dietcare CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Salin `.env.example` menjadi `.env`:

```powershell
Copy-Item .env.example .env
```

Sesuaikan `DATABASE_URL`. Untuk XAMPP default, gunakan user `root` tanpa password:

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
DEFAULT_ADMIN_NAME=Administrator
DEFAULT_ADMIN_EMAIL=admin@sinagar.local
DEFAULT_ADMIN_PASSWORD=admin123
```

Saat server startup, tabel dibuat otomatis dengan SQLAlchemy `create_all`.

## Admin Default

Admin default hanya dibuat saat:

```env
APP_ENV=development
DEFAULT_ADMIN_PASSWORD=...
```

Jika email admin sudah ada di database, backend tidak akan membuat ulang admin tersebut.

Password disimpan sebagai hash bcrypt, bukan plain text.

Untuk Swagger Authorize, gunakan:

```text
username: admin@sinagar.local
password: admin123
```

Field `username` pada Swagger OAuth2 dipakai sebagai email admin.

## Jalankan Server

```powershell
.\venv\Scripts\python.exe -m uvicorn app.main:app --reload
```

Buka:

```text
http://127.0.0.1:8000/docs
```

Jika port 8000 sedang dipakai:

```powershell
.\venv\Scripts\python.exe -m uvicorn app.main:app --port 8002 --reload
```

## Testing via Swagger

Urutan test:

1. `GET /api/health`
2. `POST /api/auth/token` lewat tombol Authorize Swagger
3. `GET /api/model/info`
4. `POST /api/predictions/predict`
5. `POST /api/residents`
6. `GET /api/residents`
7. `GET /api/residents/{resident_id}`
8. `PUT /api/residents/{resident_id}`
9. `GET /api/residents/import-template`
10. `POST /api/residents/import-preview`
11. `POST /api/residents/import-classify`
12. `POST /api/predictions/residents/{resident_id}`
13. `GET /api/dashboard/summary`
14. `GET /api/reports`
15. `GET /api/reports/latest`
16. `GET /api/reports/history`
17. `GET /api/reports/{classification_id}`
18. `DELETE /api/residents/{resident_id}`

Panduan detail ada di:

```text
SWAGGER_TESTING.md
```

## Contoh Body Predict

```json
{
  "Gender": "Male",
  "Age": 26,
  "Height": 1.85,
  "Weight": 105,
  "family_history_with_overweight": "yes",
  "FAVC": "yes",
  "FCVC": 3,
  "NCP": 3,
  "CAEC": "Frequently",
  "SMOKE": "no",
  "CH2O": 3,
  "SCC": "no",
  "FAF": 2,
  "TUE": 2,
  "CALC": "Sometimes",
  "MTRANS": "Public_Transportation"
}
```

## Import Excel Data Penduduk

Endpoint import Excel hanya untuk input data penduduk dan klasifikasi massal, bukan untuk training model.

Template Excel:

```text
GET /api/residents/import-template
```

Template yang dihasilkan memiliki sheet:

- `Input_Penduduk`: format utama untuk petugas desa, memakai label Bahasa Indonesia dan pilihan dropdown.
- `Panduan_Pengisian`: panduan singkat.
- `Kode_Sistem`: referensi mapping pilihan petugas ke nilai sistem/model.
- `resident_import`: format teknis lama untuk fallback.

Preview validasi tanpa menyimpan database:

```text
POST /api/residents/import-preview
```

Import dan klasifikasi massal:

```text
POST /api/residents/import-classify
```

Kolom wajib template:

```text
Nama Penduduk, Jenis Kelamin, Usia, Tinggi Badan (cm), Berat Badan (kg),
Riwayat Keluarga Obesitas, Konsumsi Makanan Tinggi Kalori / Fast Food,
Frekuensi Konsumsi Sayur, Jumlah Makan Utama,
Kebiasaan Makan di Antara Waktu Makan, Merokok, Konsumsi Air Harian,
Kebiasaan Mengontrol Kalori, Frekuensi Aktivitas Fisik,
Durasi Penggunaan Perangkat Teknologi, Konsumsi Alkohol,
Jenis Transportasi Harian
```

Jika file tidak memiliki sheet `Input_Penduduk`, backend tetap menerima format teknis lama dengan header:

```text
name, gender, age, height, weight, family_history_with_overweight,
favc, fcvc, ncp, caec, smoke, ch2o, scc, faf, tue, calc, mtrans
```

Admin tidak perlu mengisi BMI. Backend menghitung BMI otomatis dan menyimpan hasil klasifikasi ke `classification_results`.

## Input Tinggi Badan dan BMI

Backend tidak menerima input BMI manual.

Field tinggi badan (`height` pada resident dan `Height` pada prediksi model) boleh diisi dalam:

- meter, contoh `1.6`
- sentimeter, contoh `160`

Backend menormalisasi tinggi badan ke meter sebelum menyimpan resident, menghitung BMI, dan mengirim fitur `Height` ke model.

Rumus BMI:

```text
BMI = Weight / (Height ** 2)
```

Dengan `Height` dalam meter dan `Weight` dalam kilogram.

Contoh:

```text
Height = 160
Weight = 105
BMI = 41.02
```

## Nilai Kategorikal

Gunakan nilai persis berikut:

- `Gender`: `Male`, `Female`
- yes/no: `yes`, `no`
- `CAEC`, `CALC`: `no`, `Sometimes`, `Frequently`, `Always`
- `MTRANS`: `Automobile`, `Motorbike`, `Bike`, `Public_Transportation`, `Walking`

## CORS

Default CORS development:

```text
http://localhost:5173
http://localhost:3000
```
