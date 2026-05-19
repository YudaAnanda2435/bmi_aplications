# AGENTS.md
# Global Project Instructions

## Project Identity

Product name: Sinagar DietCare

Project type:
- Fullstack web application
- Backend: FastAPI + MySQL
- Frontend: React JS + Vite + Tailwind CSS
- Machine learning implementation: Naive Bayes obesity classification

Thesis context:
- System direction: web-based admin system for obesity status classification, diet recommendation, and early warning.
- Study case context: Masyarakat Kampung Sinagar.
- Dataset source: public or journal obesity dataset.
- Implementation context: admin inputs resident data from Kampung Sinagar into the web system.
- Model output: Underweight, Normal, Overweight, Obesity.
- Additional output: diet recommendation and early warning status.

Final model direction:
- Algorithm: Categorical Naive Bayes.
- Final feature engineering: BMI/IMT is computed from Weight and Height.
- Backend must compute BMI automatically.
- Frontend must not require admin to manually input BMI.

Do not change the thesis concept without explicit user approval.

---

## Product Scope

This system is an internal/admin web application.

Main user:
- Admin
- Researcher
- Village staff or data operator

Resident role:
- Residents do not need public login.
- Residents are data objects entered by admin.

Core flow:
1. Admin logs in.
2. Admin sees dashboard.
3. Admin manages resident data.
4. Admin inputs resident data based on attributes used by the model.
5. Backend computes BMI.
6. Backend predicts obesity status using the final Naive Bayes model.
7. System displays classification result.
8. System displays diet recommendation.
9. System displays early warning.
10. Admin can view reports.

---

## Strict Boundaries

Do not add:
- Public user registration for residents
- Doctor consultation
- Doctor chat
- Medical diagnosis feature
- Prescription feature
- Payment
- Food marketplace
- Meal planner subscription
- Commercial diet app features
- Hospital management features
- Complex role management unless requested
- Unrelated analytics
- Social media features
- Notification system unless requested

The system is not a diagnosis tool. Always treat output as early information.

Allowed wording:
- informasi awal
- alat bantu
- rekomendasi awal
- tidak menggantikan saran tenaga kesehatan

Avoid wording:
- diagnosis
- keputusan medis
- penanganan medis pasti
- obat
- terapi

---

## Required System Modules

Backend modules:
- Auth admin
- Model info
- Resident CRUD
- Prediction
- Classification result storage
- Dashboard summary
- Report list and detail

Frontend modules:
- Login page
- Protected route
- Dashboard page
- Resident list page
- Add resident page
- Edit resident page
- Resident detail page
- Prediction result page
- Report page
- Report detail page

Optional later:
- Print report
- Export report
- Upload dataset page
- Admin setting page

Do not implement optional features before the core flow works.

---

## Backend Summary

Backend folder: `backend/`

Backend stack:
- FastAPI
- SQLAlchemy
- MySQL
- Pydantic
- JWT auth
- joblib
- pandas
- scikit-learn

Final model files:
- `backend/ml_models/naive_bayes_obesity_model_final.pkl`
- `backend/ml_models/model_metadata_final.json`

Recommended base URL for frontend development:

```text
http://127.0.0.1:8000
```

---

## Frontend Summary

Frontend folder: `frontend/`

Frontend stack:
- React JS
- Vite
- Tailwind CSS
- React Router
- Axios
- Optional icons: lucide-react or react-icons

Frontend design direction:
- Modern admin dashboard
- Clean health dashboard
- Professional
- Trustworthy
- Minimal
- Soft green health theme
- Clear cards and tables
- Not too colorful
- Not generic template style

---

## Required Backend API Contract

Auth:
- `POST /api/auth/login`
- `POST /api/auth/token` if Swagger OAuth support exists

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

Predictions:
- `POST /api/predictions/predict`
- `POST /api/predictions/residents/{resident_id}`

Reports:
- `GET /api/reports`
- `GET /api/reports/{classification_id}`

All protected endpoints require Bearer token.

---

## API Response Format

Expected success response:

```json
{
  "success": true,
  "message": "Message text",
  "data": {}
}
```

Expected error response:

```json
{
  "success": false,
  "message": "Error message",
  "data": null
}
```

If backend returns slightly different error fields, frontend must handle it gracefully.

---

## Model Input Fields

Frontend form should collect these fields. Do not ask admin to fill BMI manually.

Resident fields:

```text
name
gender
age
height
weight
family_history_with_overweight
favc
fcvc
ncp
caec
smoke
ch2o
scc
faf
tue
calc
mtrans
```

Model feature mapping in backend:

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

Frontend can use Indonesian labels, but API field names should match backend schemas.

---

## Input Value Guidance

Gender:
- Male
- Female

Yes/no fields:
- yes
- no

Fields using yes/no:
- family_history_with_overweight
- favc
- smoke
- scc

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
- fcvc
- ncp
- ch2o
- faf
- tue

Height input:
- UI may let admin input cm for usability.
- Backend should normalize if already implemented.
- If backend expects meter, frontend must convert cm to meter before sending.
- Prefer showing label: Tinggi Badan (cm), then convert to meter before API if backend does not normalize.
- Confirm current backend behavior before finalizing FE.

Weight input:
- kilograms.

---

## Recommended Fullstack Folder Structure

```text
bmi_app/
├── AGENTS.md
├── backend/
│   ├── AGENTS.md
│   ├── app/
│   ├── ml_models/
│   ├── .env
│   ├── .env.example
│   └── requirements.txt
└── frontend/
    ├── AGENTS.md
    ├── package.json
    ├── index.html
    ├── src/
    └── ...
```

---

## Development Order

1. Finalize backend endpoints.
2. Test backend through Swagger.
3. Setup frontend React + Vite + Tailwind.
4. Build layout and routing.
5. Build login and auth guard.
6. Build API client.
7. Build dashboard.
8. Build residents CRUD.
9. Build prediction flow.
10. Build reports.
11. Polish UI.
12. Test frontend to backend integration.

Do not build frontend UI before backend endpoint names and request bodies are stable.

---

## Coding Style

General:
- Keep code readable.
- Prefer simple architecture.
- Avoid overengineering.
- Use clear names.
- Avoid unnecessary dependencies.
- Do not hardcode backend URLs inside many files.

Frontend:
- Use reusable elements.
- Keep pages thin.
- Put large page sections inside fragments.
- Put small reusable components inside elements.
- Keep API calls inside services.
- Keep auth logic inside hooks/context.

Backend:
- Keep route handlers clean.
- Put ML logic in service.
- Put recommendation rules in service.
- Put database models in models folder.
- Keep env config centralized.

---

## Definition of Done

The system is considered complete when:
- Backend runs without error.
- MySQL connection works.
- Admin can login.
- Frontend login works.
- Token is stored and used for protected requests.
- Dashboard loads data from backend.
- Resident list works.
- Add resident works.
- Edit resident works.
- Delete resident works.
- Predict resident works.
- Prediction result displays status, recommendation, early warning, probability, and BMI.
- Reports list works.
- Report detail works.
- Logout works.
- No out-of-scope features were added.
- Screenshots can be used for Chapter 4.
