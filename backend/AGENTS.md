# AGENTS.md

## Project Identity

Product name: DietCare

Project type:
- FastAPI backend
- MySQL database
- Admin/internal web system
- Machine learning inference service using Naive Bayes

Thesis context:
- Sistem Web Rekomendasi Pola Diet dan Peringatan Dini Berdasarkan Klasifikasi Status Obesitas Menggunakan Algoritma Naive Bayes.
- Studi kasus: masyarakat Kampung Sinagar.
- Dataset training: dataset publik atau dataset jurnal obesity.
- Implementasi sistem: admin memasukkan data penduduk ke web; pada penelitian ini studi kasusnya adalah Kampung Sinagar.
- Output utama: klasifikasi status obesitas, rekomendasi pola diet, dan peringatan dini.

Final model:
- Algorithm: Categorical Naive Bayes.
- Feature engineering: BMI/IMT dihitung dari Height dan Weight.
- Target output sistem:
  - Underweight
  - Normal
  - Overweight
  - Obesity

Expected final model files in `ml_models/`:
- `naive_bayes_obesity_model_final.pkl`
- `model_metadata_final.json`

Do not change the thesis concept without explicit user approval.

---

## Core System Flow

1. Admin login.
2. Admin input data penduduk.
3. Backend menghitung BMI dari Height dan Weight.
4. Backend membuat DataFrame sesuai fitur model final.
5. Backend memuat model `naive_bayes_obesity_model_final.pkl`.
6. Backend memprediksi status obesitas.
7. Backend menampilkan hasil klasifikasi, rekomendasi, dan peringatan dini.
8. Backend menyimpan data penduduk dan hasil klasifikasi ke MySQL.
9. Backend menyediakan dashboard dan laporan.

---

## Non-Negotiable Rules

### Do not drift from the thesis scope

Do not add:
- Doctor consultation
- Medical diagnosis
- Prescription
- Doctor chatbot
- Food marketplace
- Payment
- Public resident registration
- Commercial diet subscription
- Hospital management features

The system is an admin/internal web system, not a public health app.

### Do not claim medical certainty

Allowed wording:
- informasi awal
- alat bantu
- tidak menggantikan saran tenaga kesehatan

Avoid wording:
- diagnosis pasti
- obat
- terapi medis
- hasil kesehatan final

### Do not ask the user to input BMI manually

Backend must compute BMI:

```python
BMI = Weight / (Height ** 2)
```

Height unit: meters. Example: `1.65`.
Weight unit: kilograms. Example: `70`.

### Preserve model feature names

The final model expects these feature names:

```text
Gender
Age
Height
Weight
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
BMI
```

Do not rename these columns before sending data to the model.
Database fields may use snake_case. The ML service must map request/database fields into exact model feature names.

### Use the final model only

Do not use older files:
- `naive_bayes_obesity_model.pkl`
- `naive_bayes_obesity_model_v2.pkl`
- `naive_bayes_obesity_model_v3.pkl`
- `naive_bayes_obesity_model_v4.pkl`

Use:
- `naive_bayes_obesity_model_final.pkl`

---

## Backend Stack

Use:
- FastAPI
- SQLAlchemy ORM
- MySQL
- Pydantic v2
- JWT auth
- joblib
- pandas
- numpy

Avoid:
- Django
- Flask
- MongoDB
- SQLite as main DB
- async SQLAlchemy unless requested

Keep the backend simple because the user is frontend-focused.

---

## Recommended Folder Structure

```text
backend/
├── app/
│   ├── main.py
│   ├── api/
│   │   └── routes/
│   │       ├── auth.py
│   │       ├── dashboard.py
│   │       ├── residents.py
│   │       ├── predictions.py
│   │       ├── reports.py
│   │       └── model_info.py
│   ├── core/
│   │   ├── config.py
│   │   └── security.py
│   ├── db/
│   │   ├── base.py
│   │   ├── session.py
│   │   └── init_db.py
│   ├── models/
│   │   ├── user.py
│   │   ├── resident.py
│   │   └── classification.py
│   ├── schemas/
│   │   ├── auth.py
│   │   ├── resident.py
│   │   ├── classification.py
│   │   └── dashboard.py
│   ├── services/
│   │   ├── ml_service.py
│   │   ├── recommendation_service.py
│   │   └── dashboard_service.py
│   └── utils/
│       └── response.py
├── ml_models/
│   ├── naive_bayes_obesity_model_final.pkl
│   └── model_metadata_final.json
├── .env
├── .env.example
├── requirements.txt
├── README.md
└── AGENTS.md
```

---

## Database Tables

### users

Purpose: stores admin accounts.

Fields:
- id
- name
- email
- password_hash
- created_at
- updated_at

### residents

Purpose: stores resident input data for the study case.

Fields:
- id
- created_by
- name
- gender
- age
- height
- weight
- bmi
- family_history_with_overweight
- favc
- fcvc
- ncp
- caec
- smoke
- ch2o
- scc
- faf
- tue
- calc
- mtrans
- created_at
- updated_at

### classification_results

Purpose: stores saved prediction results.

Fields:
- id
- resident_id
- predicted_class
- probability_underweight
- probability_normal
- probability_overweight
- probability_obesity
- recommendation
- early_warning
- note
- created_at

---

## Required API Routes

### Auth

- `POST /api/auth/login`

### Dashboard

- `GET /api/dashboard/summary`

### Model Info

- `GET /api/model/info`

### Residents

- `GET /api/residents`
- `POST /api/residents`
- `GET /api/residents/{resident_id}`
- `PUT /api/residents/{resident_id}`
- `DELETE /api/residents/{resident_id}`

### Predictions

- `POST /api/predictions/predict`
  - predicts from raw input and does not save
- `POST /api/predictions/residents/{resident_id}`
  - predicts from stored resident data and saves result

### Reports

- `GET /api/reports`
- `GET /api/reports/{classification_id}`

Optional later:
- export PDF
- export CSV

Do not implement PDF export before core prediction and database flow works.

---

## Input Validation Rules

Required input fields:

```text
Gender
Age
Height
Weight
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

Height:
- Unit: meters
- Example: `1.65`
- Must be greater than 0

Weight:
- Unit: kilograms
- Example: `70`
- Must be greater than 0

BMI:
- Computed by backend
- Do not accept BMI as required user input

Categorical values:

Gender:
- Male
- Female

Yes/no fields:
- yes
- no

Fields using yes/no:
- family_history_with_overweight
- FAVC
- SMOKE
- SCC

CAEC:
- no
- Sometimes
- Frequently
- Always

CALC:
- no
- Sometimes
- Frequently
- Always

MTRANS:
- Automobile
- Motorbike
- Bike
- Public_Transportation
- Walking

Numeric lifestyle fields:
- FCVC
- NCP
- CH2O
- FAF
- TUE

Keep numeric lifestyle fields as float because the final model pipeline handles discretization internally.

---

## Recommendation and Early Warning Rules

### Normal

Recommendation:
- Pertahankan pola makan seimbang, konsumsi sayur, batasi makanan cepat saji, dan lakukan aktivitas fisik secara rutin.

Early warning:
- Aman

### Underweight

Recommendation:
- Tingkatkan asupan gizi seimbang, perhatikan jumlah makan utama, dan pantau kondisi berat badan secara berkala.

Early warning:
- Perlu Perhatian

### Overweight

Recommendation:
- Kurangi konsumsi makanan cepat saji, batasi makanan tinggi kalori, tingkatkan konsumsi sayur, dan lakukan aktivitas fisik secara rutin.

Early warning:
- Perlu Perhatian

### Obesity

Recommendation:
- Atur pola makan secara lebih terkontrol, kurangi makanan tinggi kalori dan makanan cepat saji, tingkatkan aktivitas fisik, serta lakukan pemantauan kondisi secara berkala.

Early warning:
- Risiko Tinggi

Default:
- Data belum dapat diberikan rekomendasi.
- Tidak Diketahui

---

## API Response Style

Success:

```json
{
  "success": true,
  "message": "Prediction created successfully",
  "data": {}
}
```

Error:

```json
{
  "success": false,
  "message": "Validation error",
  "detail": {}
}
```

---

## Development Phases

### Phase 1: Prediction API

Implement first:
- FastAPI startup
- model loading
- `/api/model/info`
- `/api/predictions/predict`

Goal:
- send JSON input
- get predicted class, recommendation, early warning, BMI, probabilities

### Phase 2: Database

Implement:
- SQLAlchemy engine
- ORM models
- MySQL tables
- resident CRUD
- classification result saving

### Phase 3: Auth

Implement:
- admin login
- password hashing
- JWT token
- route protection

### Phase 4: Dashboard and Report

Implement:
- total residents
- total classification results
- class distribution
- report list
- report detail

### Phase 5: FE Integration

Support:
- CORS for React frontend
- stable JSON response
- predictable validation messages

---

## Coding Standards

Use:
- type hints
- Pydantic schemas
- SQLAlchemy ORM models
- dependency injection for DB session
- services for business logic
- small route handlers

Avoid:
- putting all code in `main.py`
- mixing raw SQL everywhere
- hardcoding credentials
- hardcoding absolute model paths
- returning raw SQLAlchemy objects without conversion

---

## Security Notes

- Never store plain-text password.
- Hash password with bcrypt.
- Keep `SECRET_KEY` in `.env`.
- Do not commit `.env`.
- Allow frontend origin through CORS in development.
- Add production hardening only after local system works.

---

## Environment Variables

Use `.env`:

```env
APP_NAME=DietCare API
APP_ENV=development
DATABASE_URL=mysql+pymysql://root:password@localhost:3306/sinagar_dietcare
SECRET_KEY=change-this-secret-key
ACCESS_TOKEN_EXPIRE_MINUTES=1440
MODEL_PATH=ml_models/naive_bayes_obesity_model_final.pkl
MODEL_METADATA_PATH=ml_models/model_metadata_final.json
BACKEND_CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

---

## MySQL Setup

Create database:

```sql
CREATE DATABASE sinagar_dietcare CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

---

## Testing Checklist

### Prediction test

Endpoint:
- `POST /api/predictions/predict`

Sample input:

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
- BMI computed
- predicted_class returned
- probabilities returned if model supports predict_proba
- recommendation returned
- early_warning returned

### CRUD test

- Create resident
- Read resident list
- Update resident
- Classify resident
- View report
- Delete resident

---

## Notes for Codex or Other Coding Agents

1. Read this file before coding.
2. Do not change thesis concept.
3. Do not change model input fields.
4. Do not remove BMI computation.
5. Do not implement unrelated health features.
6. Keep backend simple and maintainable.
7. Use the final model file only.
8. Maintain consistent API responses.
9. Ask before adding optional features.
10. Make changes in small steps and explain modified files.

---

## Definition of Done

Backend is complete when:

- FastAPI runs without error.
- MySQL connection works.
- Tables are created.
- Admin can login.
- Final model loads.
- `/api/predictions/predict` works.
- Resident CRUD works.
- Stored resident can be classified.
- Classification result is saved.
- Dashboard summary works.
- Report list and detail work.
- Swagger docs open at `/docs`.
- React frontend can call API through CORS.
