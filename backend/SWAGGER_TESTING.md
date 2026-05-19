# Panduan Testing Swagger - Sinagar DietCare API

Jalankan backend dari folder `backend`:

```powershell
.\venv\Scripts\python.exe -m uvicorn app.main:app --reload
```

Buka Swagger:

```text
http://127.0.0.1:8000/docs
```

Jika port `8000` sedang dipakai, jalankan dengan port lain, contoh:

```powershell
.\venv\Scripts\python.exe -m uvicorn app.main:app --port 8002 --reload
```

## Akun Admin Development

Gunakan akun admin yang sudah dibuat untuk testing lokal:

```text
email: admin@sinagar.local
password: admin123
```

Jika database dibuat ulang, set nilai ini di `.env`, lalu restart backend agar admin default dibuat otomatis:

```env
APP_ENV=development
DEFAULT_ADMIN_NAME=Administrator
DEFAULT_ADMIN_EMAIL=admin@sinagar.local
DEFAULT_ADMIN_PASSWORD=admin123
```

## Urutan Test Endpoint

### 1. Health Check

Endpoint:

```text
GET /api/health
```

Expected:

```json
{
  "success": true,
  "message": "Sinagar DietCare API is running",
  "data": {}
}
```

### 2. Login

Endpoint:

```text
POST /api/auth/login
```

Body:

```json
{
  "email": "admin@sinagar.local",
  "password": "admin123"
}
```

Copy `data.access_token`, klik tombol **Authorize** di Swagger, isi:

```text
Bearer <access_token>
```

### 3. Model Info

Endpoint:

```text
GET /api/model/info
```

Expected:

- `model_loaded: true`
- `model_file: naive_bayes_obesity_model_final.pkl`
- fitur model memuat `BMI`

### 4. Predict Raw Input

Endpoint:

```text
POST /api/predictions/predict
```

Body:

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

Expected:

- `data.bmi` dihitung otomatis
- `data.predicted_class` muncul
- `data.probabilities` muncul
- `recommendation` dan `early_warning` tetap muncul untuk kompatibilitas frontend
- plan rekomendasi rule-based muncul: `diet_pattern`, `recommendation_summary`, `main_recommendations`, `meal_schedule`, `additional_notes`, dan `method`
- `method` bernilai `Rule-Based Recommendation / Forward Chaining`

### 5. Create Resident

Endpoint:

```text
POST /api/residents
```

Body:

```json
{
  "name": "Budi Swagger Test",
  "gender": "Male",
  "age": 26,
  "height": 1.85,
  "weight": 105,
  "family_history_with_overweight": "yes",
  "favc": "yes",
  "fcvc": 3,
  "ncp": 3,
  "caec": "Frequently",
  "smoke": "no",
  "ch2o": 3,
  "scc": "no",
  "faf": 2,
  "tue": 2,
  "calc": "Sometimes",
  "mtrans": "Public_Transportation"
}
```

Expected:

- response `success: true`
- simpan `data.id` sebagai `resident_id`
- `data.bmi` dihitung otomatis

### 6. Residents List dan Detail

Endpoint:

```text
GET /api/residents
GET /api/residents/{resident_id}
```

Expected:

- list berisi data resident
- detail menampilkan resident sesuai `resident_id`

### 7. Update Resident

Endpoint:

```text
PUT /api/residents/{resident_id}
```

Body contoh:

```json
{
  "weight": 95
}
```

Expected:

- `data.weight` berubah
- `data.bmi` dihitung ulang

### 8. Predict Stored Resident

Endpoint:

```text
POST /api/predictions/residents/{resident_id}
```

Expected:

- hasil prediksi tersimpan ke `classification_results`
- response memuat `classification_id`
- simpan `classification_id` untuk test report detail

### 9. Import Excel Template

Endpoint:

```text
GET /api/residents/import-template
```

Expected:

- download file `resident_import_template.xlsx`
- file berisi sheet `Input_Penduduk`, `Panduan_Pengisian`, `Kode_Sistem`, dan `resident_import`
- isi data pada sheet `Input_Penduduk` yang memakai label Bahasa Indonesia
- tidak ada kolom BMI

### 10. Import Preview

Endpoint:

```text
POST /api/residents/import-preview
```

Gunakan `Choose File` di Swagger, upload template atau file Excel sesuai template.

Expected:

- sheet `Input_Penduduk` terbaca sebagai sumber utama
- pilihan Bahasa Indonesia dipetakan ke nilai sistem/model
- `total_rows`
- `valid_count`
- `error_count`
- `preview_valid_data`
- `errors`
- data tidak disimpan ke database

### 11. Import Classify

Endpoint:

```text
POST /api/residents/import-classify
```

Gunakan file Excel yang sama.

Expected:

- data valid tersimpan ke `residents`
- BMI dihitung otomatis
- klasifikasi dijalankan dengan model final
- hasil tersimpan ke `classification_results`
- response memuat `imported_count`, `failed_count`, `class_distribution`, `warning_distribution`, dan `errors`

### 12. Dashboard

Endpoint:

```text
GET /api/dashboard/summary
```

Expected:

- `total_residents`
- `total_classifications`
- `class_distribution`

### 13. Reports

Endpoint:

```text
GET /api/reports
GET /api/reports/latest
GET /api/reports/history
GET /api/reports/{classification_id}
```

Expected:

- list menampilkan riwayat klasifikasi
- latest menampilkan hasil klasifikasi terakhir per penduduk
- history menampilkan semua proses klasifikasi
- detail menampilkan data klasifikasi dan data resident

### 14. Delete Resident

Endpoint:

```text
DELETE /api/residents/{resident_id}
```

Expected:

- response `success: true`
- data resident terhapus

## Catatan Validasi

Gunakan nilai kategorikal persis seperti dataset:

- `Gender`: `Male`, `Female`
- yes/no: `yes`, `no`
- `CAEC`, `CALC`: `no`, `Sometimes`, `Frequently`, `Always`
- `MTRANS`: `Automobile`, `Motorbike`, `Bike`, `Public_Transportation`, `Walking`

Backend tidak menerima input `bmi`; BMI selalu dihitung dari `height` dan `weight`.

Untuk template Excel baru, gunakan pilihan dropdown Bahasa Indonesia pada sheet `Input_Penduduk`. Jika ada nilai yang tidak dikenal, response `errors` akan menampilkan `row_number`, nama kolom, dan pesan validasi.
