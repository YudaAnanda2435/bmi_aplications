# Sistem Klasifikasi Status Obesitas dan Rekomendasi Pola Diet Berbasis Web

Sinagar DietCare adalah web admin untuk mengelola data penduduk, melakukan klasifikasi status obesitas, menampilkan rekomendasi pola diet, jadwal makan, peringatan dini, laporan, riwayat klasifikasi, import Excel, dan cetak PDF laporan.

Sistem ini dibuat untuk kebutuhan akademik/skripsi dengan studi kasus masyarakat Kampung Sinagar. Pengguna utama sistem adalah admin, peneliti, atau pengelola data. Penduduk tidak memiliki akun publik dan hanya menjadi data yang dikelola oleh admin.

## Deskripsi Singkat Sistem

Sinagar DietCare digunakan oleh admin atau pengelola untuk:

- Mengelola data penduduk.
- Input manual data penduduk.
- Import Excel data penduduk.
- Klasifikasi status obesitas.
- Melihat rekomendasi pola diet.
- Melihat jadwal makan.
- Melihat peringatan dini.
- Melihat laporan klasifikasi terakhir.
- Melihat riwayat klasifikasi.
- Mencetak laporan PDF.

Sistem ini adalah aplikasi internal berbasis web, bukan aplikasi publik untuk penduduk.

## Penjelasan Metode

Sistem memakai dua metode karena proses klasifikasi dan proses rekomendasi memiliki tujuan yang berbeda.

### 1. Naive Bayes untuk Klasifikasi Status Obesitas

Naive Bayes digunakan untuk menentukan kelas status obesitas penduduk.

Output klasifikasi:

- Underweight
- Normal
- Overweight
- Obesity

Model Naive Bayes final menggunakan fitur:

- Gender
- Age
- Height
- Weight
- BMI_Category

`BMI_Category` dibentuk dari nilai BMI dengan aturan:

| Nilai BMI | BMI_Category |
| --- | --- |
| BMI < 18.5 | BMI_Underweight |
| 18.5 <= BMI < 25 | BMI_Normal |
| 25 <= BMI < 30 | BMI_Overweight |
| BMI >= 30 | BMI_Obesity |

Catatan penting:

- `BMI_Category` hanya digunakan sebagai fitur input model Naive Bayes.
- Hasil klasifikasi tidak ditentukan manual oleh BMI.
- `predicted_class` tetap berasal dari model Naive Bayes.
- Backend menghitung BMI secara otomatis dari tinggi dan berat badan.
- Frontend tidak meminta admin mengisi BMI secara manual.

### 2. Rule-Based Recommendation / Forward Chaining untuk Rekomendasi

Rule-Based Recommendation / Forward Chaining digunakan setelah hasil klasifikasi Naive Bayes keluar.

Metode ini menghasilkan:

- Rekomendasi pola diet.
- Jadwal makan.
- Peringatan dini.
- Catatan sistem.
- Dasar rekomendasi.

Atribut yang digunakan untuk rekomendasi:

- family_history_with_overweight
- FAVC
- FCVC
- NCP
- CAEC
- SMOKE
- CH2O
- SCC
- FAF
- TUE
- CALC
- MTRANS

Atribut tersebut tetap dipakai oleh sistem, tetapi bukan sebagai fitur utama model Naive Bayes final. Atribut pola makan, kebiasaan hidup, dan aktivitas digunakan sebagai fakta kondisi untuk proses rekomendasi berbasis aturan.

Dengan pembagian ini:

- Naive Bayes menentukan status obesitas.
- Rule-Based Recommendation / Forward Chaining memberi rekomendasi yang lebih terarah berdasarkan hasil klasifikasi dan atribut kebiasaan hidup.

## Pemanfaatan Dataset

Dataset obesitas tetap digunakan dalam sistem ini. Dataset tidak dibuang, tetapi fungsinya dipisahkan sesuai kebutuhan metode.

Pemanfaatan dataset:

- Untuk Naive Bayes: dataset digunakan untuk training dan testing model klasifikasi status obesitas.
- Untuk Rule-Based Recommendation: atribut dataset menjadi dasar field input dan fakta kondisi untuk rekomendasi.

Pembagian penggunaan atribut:

- Fitur antropometri digunakan untuk klasifikasi:
  - Gender
  - Age
  - Height
  - Weight
  - BMI_Category

- Atribut pola makan, kebiasaan hidup, dan aktivitas digunakan untuk rekomendasi:
  - family_history_with_overweight
  - FAVC
  - FCVC
  - NCP
  - CAEC
  - SMOKE
  - CH2O
  - SCC
  - FAF
  - TUE
  - CALC
  - MTRANS

## Fitur Utama Aplikasi

- Login admin.
- Dashboard.
- Kelola data penduduk.
- Input manual data penduduk.
- Import Excel.
- Klasifikasi status obesitas.
- Rekomendasi pola diet.
- Jadwal makan.
- Peringatan dini.
- Laporan.
- Riwayat klasifikasi.
- Detail laporan.
- Cetak PDF laporan.
- Logout.

## Alur Kerja Sistem

```text
Admin input data penduduk
|
v
Sistem validasi data
|
v
Sistem hitung BMI
|
v
Sistem bentuk BMI_Category
|
v
Naive Bayes klasifikasi status obesitas
|
v
Sistem menghasilkan Underweight / Normal / Overweight / Obesity
|
v
Rule-Based Recommendation memproses atribut kebiasaan hidup
|
v
Sistem menghasilkan rekomendasi diet, jadwal makan, peringatan dini, catatan, dan dasar rekomendasi
|
v
Hasil disimpan ke laporan dan riwayat
|
v
Admin dapat mencetak PDF laporan
```

## Struktur Folder Proyek

Struktur utama repository:

```text
bmi_app/
|-- backend/
|-- frontend/
|-- AGENTS.md
|-- README.md
|-- .gitignore
|-- naive_bayes_obesity_model_final.pkl
`-- model_metadata_final.json
```

Catatan: file model final yang digunakan aplikasi harus berada di `backend/ml_models/`. File model di root dapat dianggap sebagai salinan atau arsip, tetapi konfigurasi backend mengarah ke folder `backend/ml_models/`.

### Backend

```text
backend/
|-- app/
|-- ml_models/
|-- requirements.txt
|-- .env.example
|-- AGENTS.md
|-- README.md
`-- SWAGGER_TESTING.md
```

Folder penting backend:

- `app/`: kode FastAPI, route API, model database, service ML, service rekomendasi, service import, dan service PDF.
- `ml_models/`: file model Naive Bayes final dan metadata model.
- `requirements.txt`: dependency Python.
- `.env.example`: template konfigurasi environment backend.

### Frontend

```text
frontend/
|-- src/
|-- dist/
|-- node_modules/
|-- package.json
|-- package-lock.json
|-- vite.config.js
|-- .env.example
|-- .gitignore
`-- AGENTS.md
```

Folder penting frontend:

- `src/`: kode React, halaman, layout, fragment, elemen UI, services, hooks, dan utils.
- `package.json`: dependency dan script frontend.
- `.env.example`: template konfigurasi API base URL.
- `dist/`: hasil build frontend jika sudah menjalankan `npm run build`.

## Kebutuhan Sistem

### Backend

- Python 3.10 atau lebih baru.
- FastAPI.
- Uvicorn.
- SQLAlchemy.
- MySQL.
- PyMySQL.
- scikit-learn.
- pandas.
- numpy.
- joblib.
- ReportLab.
- openpyxl.

Dependency backend lengkap ada di:

```text
backend/requirements.txt
```

### Frontend

- Node.js 18 atau lebih baru.
- npm.
- React.
- Vite.
- Tailwind CSS.
- Axios.
- React Router.
- lucide-react.
- Material UI.
- react-toastify.
- AOS.
- Swiper.

Dependency frontend lengkap ada di:

```text
frontend/package.json
```

### Database

Project menggunakan MySQL. Pada setup lokal, MySQL dapat dijalankan melalui XAMPP.

## Setup Database

1. Buka XAMPP Control Panel.
2. Start `Apache` dan `MySQL`.
3. Buka phpMyAdmin:

```text
http://localhost/phpmyadmin
```

4. Buat database:

```sql
CREATE DATABASE sinagar_dietcare CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

## Instalasi Backend

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

Pastikan file model final tersedia:

```text
backend/ml_models/naive_bayes_obesity_model_final.pkl
backend/ml_models/model_metadata_final.json
```

Jalankan server backend:

```bash
python -m uvicorn app.main:app --reload
```

Alternatif jika ingin langsung memakai Python dari venv Windows:

```bash
.\venv\Scripts\python.exe -m uvicorn app.main:app --reload
```

URL backend:

- API: `http://127.0.0.1:8000`
- Swagger: `http://127.0.0.1:8000/docs`

## Konfigurasi .env Backend

File `backend/.env.example` adalah template. Salin file tersebut menjadi `backend/.env`.

Contoh konfigurasi:

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

Penjelasan variabel penting:

- `DATABASE_URL`: koneksi database MySQL. Contoh di atas cocok untuk XAMPP root tanpa password.
- `SECRET_KEY`: kunci JWT. Ganti untuk environment production.
- `ALGORITHM`: algoritma JWT, default `HS256`.
- `ACCESS_TOKEN_EXPIRE_MINUTES`: durasi token login.
- `MODEL_PATH`: lokasi file model Naive Bayes final.
- `MODEL_METADATA_PATH`: lokasi metadata model final.
- `BACKEND_CORS_ORIGINS`: daftar origin frontend yang diizinkan.
- `DEFAULT_ADMIN_NAME`: nama admin development.
- `DEFAULT_ADMIN_EMAIL`: email admin development.
- `DEFAULT_ADMIN_PASSWORD`: password login admin development, bukan password MySQL.

## Instalasi Frontend

Masuk ke folder frontend:

```bash
cd frontend
```

Install dependency:

```bash
npm install
```

Buat file `frontend/.env` berdasarkan `frontend/.env.example`.

Isi minimal:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

Jalankan frontend:

```bash
npm run dev
```

URL default Vite:

```text
http://localhost:5173
```

## File Model Final

File model final harus berada di:

```text
backend/ml_models/naive_bayes_obesity_model_final.pkl
backend/ml_models/model_metadata_final.json
```

Metadata model final berisi `input_features`:

```json
[
  "Gender",
  "Age",
  "Height",
  "Weight",
  "BMI_Category"
]
```

Metadata juga menyimpan aturan pembentukan `BMI_Category`:

```json
{
  "BMI_Underweight": "BMI < 18.5",
  "BMI_Normal": "18.5 <= BMI < 25",
  "BMI_Overweight": "25 <= BMI < 30",
  "BMI_Obesity": "BMI >= 30"
}
```

Jika model diganti, metadata juga harus disesuaikan. Backend harus tetap membentuk fitur sesuai metadata model.

## Cara Penggunaan Sistem

1. Jalankan database MySQL.
2. Jalankan backend.
3. Jalankan frontend.
4. Buka frontend di browser.
5. Login sebagai admin.
6. Tambah data penduduk secara manual atau import Excel.
7. Jalankan klasifikasi status obesitas.
8. Lihat hasil klasifikasi.
9. Lihat rekomendasi diet dan jadwal makan.
10. Buka laporan atau riwayat klasifikasi.
11. Cetak PDF laporan jika dibutuhkan.

## Akun Admin Development

Contoh akun development:

```text
Email: admin@sinagar.local
Password: admin123
```

Jika login gagal, cek nilai `DEFAULT_ADMIN_EMAIL` dan `DEFAULT_ADMIN_PASSWORD` pada `backend/.env`.

## Import Excel

Sistem menyediakan template Excel untuk import data penduduk.

Alur import:

1. Admin membuka halaman Data Penduduk.
2. Admin klik `Download Template`.
3. Admin mengisi template sesuai format yang tersedia.
4. Admin upload file Excel.
5. Sistem melakukan preview dan validasi data.
6. Data valid dapat disimpan.
7. Sistem dapat menjalankan klasifikasi massal.
8. Data masuk ke Data Penduduk.
9. Hasil klasifikasi masuk ke Laporan dan Riwayat Klasifikasi.

Catatan:

- File harus mengikuti template resmi dari sistem.
- Data valid akan disimpan dan dapat diklasifikasikan.
- Data tidak valid harus diperbaiki terlebih dahulu.
- BMI tidak perlu diisi.
- Import Excel bukan fitur upload dataset training dan tidak melakukan retraining model.

## Output Sistem

Output utama dan output tambahan yang dapat muncul dari proses klasifikasi dan rekomendasi:

- `predicted_class`
- `bmi`
- `bmi_category`
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
- `model_version`

Keterangan ringkas:

- `predicted_class`: hasil klasifikasi dari model Naive Bayes.
- `bmi`: nilai BMI hasil perhitungan backend.
- `bmi_category`: kategori BMI yang menjadi fitur input model.
- `probabilities`: probabilitas kelas dari model jika tersedia.
- `diet_pattern`: pola diet yang direkomendasikan.
- `early_warning`: status peringatan dini.
- `goal`: tujuan rekomendasi.
- `recommendation_summary`: ringkasan rekomendasi.
- `main_recommendations`: daftar rekomendasi utama.
- `meal_schedule`: jadwal makan.
- `additional_notes`: catatan sistem.
- `method`: metode rekomendasi yang digunakan.
- `source_basis`: dasar sumber rekomendasi.
- `source_references`: detail sumber rekomendasi jika tersedia.
- `model_version`: versi model atau metadata model jika dikirim oleh backend.

## Laporan dan Riwayat Klasifikasi

### Laporan

Laporan menampilkan hasil klasifikasi terakhir dari setiap penduduk. Jika satu penduduk diklasifikasi beberapa kali, halaman laporan hanya menampilkan hasil terbaru.

### Riwayat Klasifikasi

Riwayat Klasifikasi menampilkan semua proses klasifikasi yang pernah dilakukan. Jika satu penduduk diklasifikasi beberapa kali, semua proses tersebut tetap tampil sebagai riwayat.

## Cetak PDF Laporan

Detail laporan memiliki tombol `Cetak PDF`.

PDF dibuat oleh backend menggunakan ReportLab. PDF dapat berisi:

- Identitas penduduk.
- Hasil klasifikasi.
- BMI dan kategori BMI.
- Pola diet.
- Rekomendasi utama.
- Jadwal makan.
- Peringatan dini.
- Catatan sistem.
- Metode rekomendasi.
- Dasar rekomendasi.
- Nomor halaman.

PDF mendukung multipage sehingga isi laporan yang panjang tidak hanya dicetak pada halaman pertama.

## Endpoint Backend Utama

Sebagian besar endpoint membutuhkan Bearer token setelah login.

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

### Import Excel

- `GET /api/residents/import-template`
- `POST /api/residents/import-preview`
- `POST /api/residents/import-classify`

### Prediction

- `POST /api/predictions/predict`
- `POST /api/predictions/residents/{resident_id}`

### Reports

- `GET /api/reports/latest`
- `GET /api/reports/history`
- `GET /api/reports/{classification_id}`
- `GET /api/reports/{classification_id}/pdf`

## Catatan Rekomendasi

Hasil sistem bersifat informasi awal dan alat bantu. Rekomendasi sistem tidak menggantikan saran dokter, ahli gizi, atau tenaga kesehatan.

Sistem tidak boleh dipahami sebagai alat diagnosis medis. Keputusan lebih lanjut tetap perlu mempertimbangkan arahan tenaga kesehatan yang berwenang.

## Troubleshooting

### 1. ModuleNotFoundError

Penyebab:

- Dependency belum terinstall.
- Virtual environment belum aktif.

Solusi:

```bash
cd backend
.\venv\Scripts\activate
pip install -r requirements.txt
```

Jika module tertentu masih belum ada, install sesuai pesan error. Contoh:

```bash
pip install reportlab
pip install openpyxl
```

### 2. Backend tidak jalan karena venv belum aktif

Solusi:

```bash
cd backend
.\venv\Scripts\activate
python -m uvicorn app.main:app --reload
```

### 3. Database belum dikonfigurasi

Penyebab:

- Database belum dibuat.
- `DATABASE_URL` salah.
- MySQL belum berjalan.

Solusi:

- Start MySQL di XAMPP.
- Buat database `sinagar_dietcare`.
- Cek `DATABASE_URL` pada `backend/.env`.

### 4. Frontend tidak terhubung ke backend

Penyebab:

- Backend belum berjalan.
- `VITE_API_BASE_URL` salah.
- CORS belum sesuai.

Solusi:

- Pastikan backend berjalan di `http://127.0.0.1:8000`.
- Cek `frontend/.env`.
- Cek `BACKEND_CORS_ORIGINS` pada backend.

### 5. Model .pkl tidak ditemukan

Penyebab:

- File model tidak ada di `backend/ml_models/`.
- `MODEL_PATH` salah.

Solusi:

- Pastikan file berikut tersedia:

```text
backend/ml_models/naive_bayes_obesity_model_final.pkl
```

- Cek `MODEL_PATH` pada `.env`.

### 6. Metadata model tidak ditemukan

Penyebab:

- File metadata tidak ada.
- `MODEL_METADATA_PATH` salah.

Solusi:

- Pastikan file berikut tersedia:

```text
backend/ml_models/model_metadata_final.json
```

- Cek `MODEL_METADATA_PATH` pada `.env`.

### 7. Error missing BMI_Category

Penyebab:

- Backend belum membentuk `BMI_Category`.
- Metadata model meminta `BMI_Category`, tetapi data input model belum memiliki field tersebut.

Solusi:

- Pastikan backend menghitung BMI.
- Pastikan backend membentuk `BMI_Category` sesuai aturan metadata.
- Jangan mengganti model tanpa menyesuaikan metadata dan proses feature engineering.

### 8. Port database berbeda

Penyebab:

- MySQL tidak berjalan pada port default `3306`.

Solusi:

- Cek port MySQL di XAMPP.
- Sesuaikan `DATABASE_URL`.

Contoh jika MySQL berjalan pada port `3307`:

```env
DATABASE_URL=mysql+pymysql://root:@localhost:3307/sinagar_dietcare
```

### 9. node_modules belum diinstall

Penyebab:

- Dependency frontend belum dipasang.

Solusi:

```bash
cd frontend
npm install
npm run dev
```

## Build Production

### Backend

Backend dapat dijalankan dengan Uvicorn:

```bash
cd backend
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```

Untuk deployment production, sesuaikan konfigurasi server, database, CORS, dan `SECRET_KEY`.

### Frontend

Build frontend:

```bash
cd frontend
npm run build
```

Preview hasil build:

```bash
npm run preview
```

Hasil build berada di:

```text
frontend/dist
```

## Testing Manual

Checklist pengujian:

- Backend berjalan.
- Swagger dapat dibuka.
- Database terkoneksi.
- Login admin berhasil.
- Dashboard tampil.
- Data penduduk tampil.
- Tambah data penduduk berhasil.
- Edit data penduduk berhasil.
- Hapus data penduduk berhasil.
- Import Excel berhasil melakukan preview.
- Import Excel berhasil menyimpan data valid.
- Klasifikasi status obesitas berhasil.
- `predicted_class` berasal dari model Naive Bayes.
- Rekomendasi pola diet tampil.
- Jadwal makan tampil.
- Peringatan dini tampil.
- Dasar rekomendasi tampil.
- Laporan menampilkan hasil terakhir setiap penduduk.
- Riwayat klasifikasi menampilkan seluruh proses klasifikasi.
- Detail laporan tampil.
- Cetak PDF laporan berhasil.
- Frontend build berhasil.

## Catatan untuk Developer atau Client

- Jangan menghapus folder `backend/ml_models/`.
- Jangan mengganti file model tanpa menyesuaikan metadata.
- Jangan mengubah `MODEL_PATH` dan `MODEL_METADATA_PATH` tanpa memastikan file ada.
- Jika model diganti, backend harus tetap membuat `BMI_Category` sesuai metadata.
- `BMI_Category` adalah fitur input model, bukan aturan manual untuk menentukan hasil akhir.
- Atribut pola makan dan aktivitas tetap dibutuhkan untuk rekomendasi meskipun tidak masuk fitur utama Naive Bayes.
- Jangan menghapus field input rekomendasi seperti `FAVC`, `FCVC`, `NCP`, `CAEC`, `CH2O`, `FAF`, `TUE`, `CALC`, dan `MTRANS`.
- Jangan meminta admin mengisi BMI manual.
- Jangan commit file `.env` jika project memakai Git.
- Gunakan `.env.example` sebagai template konfigurasi.

## Catatan Akademik

Project ini dibuat untuk kebutuhan akademik/skripsi. Sistem berfokus pada klasifikasi status obesitas, rekomendasi pola diet awal, jadwal makan, peringatan dini, laporan, riwayat klasifikasi, import Excel, dan cetak PDF laporan.

Pembagian metode final:

- Naive Bayes = klasifikasi status obesitas.
- Rule-Based Recommendation / Forward Chaining = rekomendasi diet, jadwal makan, peringatan dini, catatan, dan dasar rekomendasi.
