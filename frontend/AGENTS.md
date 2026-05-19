# frontend/AGENTS.md
# Frontend React Instructions

## Frontend Scope

This folder contains the React frontend for Sinagar DietCare.

The frontend must be a clean admin dashboard that connects to the existing FastAPI backend.

Do not change backend concept or model logic from frontend.

Do not create a public resident app.

Main frontend user:
- Admin

Primary frontend purpose:
- Login
- View dashboard
- Manage resident data
- Run obesity classification
- Show diet recommendation
- Show early warning
- View reports

---

## Required Tech Stack

Use:
- React JS
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- LocalStorage for JWT token
- Optional icon library: lucide-react preferred, react-icons allowed

Avoid:
- Redux unless needed
- Complex global state library
- Next.js
- Material UI unless explicitly requested
- Heavy component frameworks
- Backend logic in frontend
- ML logic in frontend

---

## Setup Requirements

Create frontend with Vite:

```bash
npm create vite@latest frontend -- --template react
cd frontend
npm install
```

Install required packages:

```bash
npm install react-router-dom axios lucide-react
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Configure Tailwind:

`tailwind.config.js`

```js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {}
  },
  plugins: []
}
```

`src/index.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

## Frontend Folder Structure

Use this structure.

```text
frontend/
├── AGENTS.md
├── package.json
├── index.html
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
├── .env
├── .env.example
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    ├── assets/
    │   └── images/
    ├── components/
    │   ├── elements/
    │   │   ├── buttons/
    │   │   │   ├── Button.jsx
    │   │   │   └── IconButton.jsx
    │   │   ├── forms/
    │   │   │   ├── Input.jsx
    │   │   │   ├── Select.jsx
    │   │   │   ├── Textarea.jsx
    │   │   │   └── FormError.jsx
    │   │   ├── cards/
    │   │   │   ├── StatCard.jsx
    │   │   │   ├── InfoCard.jsx
    │   │   │   └── ResultCard.jsx
    │   │   ├── tables/
    │   │   │   ├── DataTable.jsx
    │   │   │   └── EmptyState.jsx
    │   │   ├── badges/
    │   │   │   ├── StatusBadge.jsx
    │   │   │   └── WarningBadge.jsx
    │   │   ├── loading/
    │   │   │   └── LoadingSpinner.jsx
    │   │   └── feedback/
    │   │       ├── Alert.jsx
    │   │       └── ConfirmDialog.jsx
    │   ├── fragments/
    │   │   ├── auth/
    │   │   │   └── LoginForm.jsx
    │   │   ├── dashboard/
    │   │   │   ├── DashboardStats.jsx
    │   │   │   ├── ClassDistribution.jsx
    │   │   │   └── RecentReports.jsx
    │   │   ├── residents/
    │   │   │   ├── ResidentForm.jsx
    │   │   │   ├── ResidentTable.jsx
    │   │   │   ├── ResidentDetailCard.jsx
    │   │   │   └── ResidentPredictionPanel.jsx
    │   │   ├── predictions/
    │   │   │   ├── PredictionResult.jsx
    │   │   │   ├── ProbabilityList.jsx
    │   │   │   └── RecommendationPanel.jsx
    │   │   └── reports/
    │   │       ├── ReportTable.jsx
    │   │       └── ReportDetail.jsx
    │   ├── layouts/
    │   │   ├── AuthLayout.jsx
    │   │   └── DashboardLayout.jsx
    │   ├── pages/
    │   │   ├── LoginPage.jsx
    │   │   ├── DashboardPage.jsx
    │   │   ├── ResidentsPage.jsx
    │   │   ├── ResidentCreatePage.jsx
    │   │   ├── ResidentEditPage.jsx
    │   │   ├── ResidentDetailPage.jsx
    │   │   ├── ReportsPage.jsx
    │   │   ├── ReportDetailPage.jsx
    │   │   └── NotFoundPage.jsx
    │   ├── routes/
    │   │   ├── AppRoutes.jsx
    │   │   └── ProtectedRoute.jsx
    │   ├── services/
    │   │   ├── apiClient.js
    │   │   ├── authService.js
    │   │   ├── dashboardService.js
    │   │   ├── residentService.js
    │   │   ├── predictionService.js
    │   │   └── reportService.js
    │   ├── hooks/
    │   │   ├── useAuth.js
    │   │   └── useApi.js
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── constants/
    │   │   ├── routes.js
    │   │   ├── options.js
    │   │   └── labels.js
    │   └── utils/
    │       ├── formatters.js
    │       ├── validators.js
    │       └── bmi.js
```

---

## Component Architecture Rule

This project must use the structure:

```text
pages -> fragments -> elements
```

Pages should be thin.

Pages:
- handle route-level behavior
- call API services
- hold page-level state
- call fragments to render large content

Pages should not contain large UI blocks.

Example:

```jsx
// pages/ResidentsPage.jsx
import ResidentTable from "../components/fragments/residents/ResidentTable";

export default function ResidentsPage() {
  return <ResidentTable />;
}
```

Fragments contain large sections of a page.

Fragments can:
- render form sections
- render page tables
- render dashboard content
- render large cards or grouped UI
- call smaller element components

Examples:
- LoginForm
- DashboardStats
- ResidentForm
- ResidentTable
- PredictionResult
- ReportTable

Elements are small reusable components.

Examples:
- Button
- Input
- Select
- StatCard
- DataTable
- StatusBadge
- Alert
- LoadingSpinner

Elements should not call API directly.

---

## Styling Direction

Use Tailwind CSS.

Design personality:
- Modern
- Clean
- Professional
- Trustworthy
- Minimal
- Friendly health dashboard

Preferred colors:
- Primary: green or emerald
- Background: soft gray or white
- Accent: amber or orange for warnings
- Danger: red for delete or high risk
- Text: dark slate or neutral gray

Do not make the UI:
- too colorful
- too playful
- like a hospital enterprise system
- like a commercial diet app
- like a generic free template
- cramped horizontally

UI requirements:
- comfortable spacing
- clear cards
- readable tables
- clear badges
- consistent button style
- desktop-first but responsive

---

## Required Pages

### 1. LoginPage

Path: `/login`

Purpose:
- Admin login.

Required UI:
- App name
- Short description
- Email input
- Password input
- Login button
- Error message

Must call:
- `POST /api/auth/login`

After success:
- save token to localStorage
- redirect to dashboard

Do not create:
- register page
- forgot password unless requested
- social login

### 2. DashboardPage

Path: `/dashboard`

Purpose:
- Show system overview.

Must call:
- `GET /api/dashboard/summary`

Required UI:
- Total residents
- Total classifications
- Class distribution
- Quick action to add resident
- Quick action to view reports

Use fragments:
- DashboardStats
- ClassDistribution

### 3. ResidentsPage

Path: `/residents`

Purpose:
- Show resident data list.

Must call:
- `GET /api/residents`
- `DELETE /api/residents/{id}`

Required UI:
- Table
- Search input if simple
- Add resident button
- Detail button
- Edit button
- Delete button
- Predict button

Use fragment:
- ResidentTable

### 4. ResidentCreatePage

Path: `/residents/create`

Purpose:
- Add resident data.

Must call:
- `POST /api/residents`

Required UI:
- ResidentForm

After success:
- redirect to resident list or detail page

### 5. ResidentEditPage

Path: `/residents/:id/edit`

Purpose:
- Edit resident data.

Must call:
- `GET /api/residents/{id}`
- `PUT /api/residents/{id}`

Required UI:
- ResidentForm with initial values

After success:
- redirect to resident detail or list

### 6. ResidentDetailPage

Path: `/residents/:id`

Purpose:
- Show resident detail and classify stored resident.

Must call:
- `GET /api/residents/{id}`
- `POST /api/predictions/residents/{id}`

Required UI:
- Resident detail card
- BMI display
- Classification button
- Result panel after prediction

Use fragments:
- ResidentDetailCard
- ResidentPredictionPanel
- PredictionResult

### 7. ReportsPage

Path: `/reports`

Purpose:
- Show classification history.

Must call:
- `GET /api/reports`

Required UI:
- Report table
- Class badge
- Warning badge
- Detail button

Use fragment:
- ReportTable

### 8. ReportDetailPage

Path: `/reports/:id`

Purpose:
- Show classification report detail.

Must call:
- `GET /api/reports/{id}`

Required UI:
- Resident identity
- Input summary
- Predicted class
- Probabilities
- Recommendation
- Early warning
- Note
- Print button optional

Use fragment:
- ReportDetail

### 9. NotFoundPage

Path: `*`

Purpose:
- Show 404 state.

---

## Required Layouts

### AuthLayout

Used by:
- LoginPage

Should include:
- centered card
- app name
- clean background
- no dashboard sidebar

### DashboardLayout

Used by protected pages.

Should include:
- sidebar navigation
- topbar
- main content area
- logout button
- responsive layout

Sidebar menu:
- Dashboard
- Data Penduduk
- Laporan

Optional:
- Model Info
- Settings

Do not add unused menus.

---

## Routing Requirements

Use React Router.

Recommended routes:

```jsx
/login
/dashboard
/residents
/residents/create
/residents/:id
/residents/:id/edit
/reports
/reports/:id
```

Protected routes:
- all routes except `/login`

Behavior:
- If no token, redirect to `/login`.
- If token exists, allow access.
- Logout clears token and redirects to `/login`.

---

## Auth Requirements

Token storage:
- localStorage key: `access_token`

Login flow:
1. user submits email and password
2. call auth service
3. save access token
4. redirect to dashboard

Logout:
1. remove access token
2. redirect to login

Axios interceptor:
- add `Authorization: Bearer <token>` for protected requests.
- if API returns 401, clear token and redirect to login.

Do not store password.

---

## API Client Requirements

Create:

```text
src/services/apiClient.js
```

Use one Axios instance:

```js
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000",
});
```

Add request interceptor:
- attach Bearer token from localStorage.

Add response interceptor:
- handle 401 gracefully.

Environment:

`.env`

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

Do not hardcode base URL in many files.

---

## Service Layer Requirements

Create service files:

### authService.js

Methods:
- login(payload)

### dashboardService.js

Methods:
- getSummary()

### residentService.js

Methods:
- getResidents()
- getResident(id)
- createResident(payload)
- updateResident(id, payload)
- deleteResident(id)

### predictionService.js

Methods:
- predictRaw(payload)
- predictResident(id)

### reportService.js

Methods:
- getReports()
- getReport(id)

Pages and fragments should use these services.

Do not call Axios directly inside many components.

---

## Resident Form Fields

Required frontend fields:

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

Labels in Indonesian:

```text
Nama Penduduk
Jenis Kelamin
Usia
Tinggi Badan
Berat Badan
Riwayat Keluarga Obesitas
Konsumsi Fast Food
Frekuensi Konsumsi Sayur
Jumlah Makan Utama
Makanan di Antara Waktu Makan
Merokok
Asupan Cairan
Mengontrol Kalori
Aktivitas Fisik
Penggunaan Teknologi
Jenis Transportasi
```

Do not include BMI input as required.

BMI can be shown after save or prediction.

---

## Form Options

Gender:

```js
[
  { label: "Laki-laki", value: "Male" },
  { label: "Perempuan", value: "Female" }
]
```

Yes/no:

```js
[
  { label: "Ya", value: "yes" },
  { label: "Tidak", value: "no" }
]
```

CAEC:

```js
[
  { label: "Tidak", value: "no" },
  { label: "Kadang-kadang", value: "Sometimes" },
  { label: "Sering", value: "Frequently" },
  { label: "Selalu", value: "Always" }
]
```

CALC:

```js
[
  { label: "Tidak", value: "no" },
  { label: "Kadang-kadang", value: "Sometimes" },
  { label: "Sering", value: "Frequently" },
  { label: "Selalu", value: "Always" }
]
```

Transportation:

```js
[
  { label: "Mobil", value: "Automobile" },
  { label: "Motor", value: "Motorbike" },
  { label: "Sepeda", value: "Bike" },
  { label: "Transportasi Umum", value: "Public_Transportation" },
  { label: "Jalan Kaki", value: "Walking" }
]
```

Numeric fields:
- age
- height
- weight
- fcvc
- ncp
- ch2o
- faf
- tue

Add helper text so admin understands approximate scale if needed.

---

## Height Handling

Backend may normalize height automatically.

Recommended UI:
- Label: Tinggi Badan
- Helper: Isi dalam cm, contoh 160, atau meter jika backend sudah menerima meter.

Before final implementation, verify backend behavior:
- height 160 and weight 105 should result BMI around 41.02.
- height 1.6 and weight 105 should result BMI around 41.02.

If backend has not normalized cm to meter, frontend must convert cm to meter before sending.

---

## Prediction Result UI

Show:
- Predicted class
- BMI
- Probability list
- Recommendation
- Early warning
- Note

Class badge mapping:
- Underweight: amber or yellow badge
- Normal: green badge
- Overweight: orange badge
- Obesity: red badge

Warning badge mapping:
- Aman: green
- Perlu Perhatian: amber or orange
- Risiko Tinggi: red

Do not make alarming medical claims.

---

## Report UI

Reports page should show:
- Date
- Resident name
- Predicted class
- Early warning
- Detail button

Report detail should show:
- Resident identity
- Height
- Weight
- BMI
- Predicted class
- Probability
- Recommendation
- Early warning
- Note
- Created date

Print button optional:
- Use `window.print()` only if simple.

---

## Dashboard UI

Dashboard cards:
- Total Penduduk
- Total Klasifikasi
- Normal
- Perlu Perhatian or Risiko Tinggi if data supports it

Class distribution:
- Use simple card/grid first.
- Chart optional.
- Do not add chart library unless necessary.

---

## Error and Loading Handling

Every page that calls API should handle:
- loading state
- empty state
- error state

Use elements:
- LoadingSpinner
- Alert
- EmptyState

Avoid blank pages.

---

## FE Integration Checklist

Before finishing frontend:
- Login works.
- Token stored.
- Protected route blocks unauthenticated users.
- Dashboard loads.
- Residents list loads.
- Create resident works.
- Edit resident works.
- Delete resident works.
- Predict resident works.
- Result displays recommendation and warning.
- Reports load.
- Report detail loads.
- Logout works.
- Refresh page keeps user authenticated if token exists.
- API errors show readable message.
- UI responsive enough for laptop and tablet.

---

## Common Mistakes to Avoid

Do not:
- build components directly inside App.jsx
- call fetch/axios all over the app
- hardcode API base URL in many files
- ask for BMI in form
- create register page
- create public user pages
- create doctor feature
- create payment feature
- show English-only labels in final UI
- change backend route names without approval
- change model feature names
- ignore 401 token errors
- use messy folder structure

---

## Prompting Notes for Codex

When Codex works on FE, always instruct it to:
1. Read root AGENTS.md and frontend/AGENTS.md.
2. Work one phase at a time.
3. Do not change backend code unless explicitly requested.
4. Keep pages thin.
5. Use fragments for page content.
6. Use elements for reusable small components.
7. Keep UI aligned with the thesis scope.
8. Test by running npm build if possible.

---

## Recommended Codex Work Phases

### Phase 1: Setup React

- Create Vite React project if not exists.
- Install Tailwind.
- Install React Router and Axios.
- Setup folder structure.
- Setup basic AppRoutes.
- Setup AuthLayout and DashboardLayout.
- Do not connect API yet.

### Phase 2: API Client and Auth

- Create apiClient.
- Create authService.
- Create AuthContext or useAuth.
- Create LoginPage.
- Create ProtectedRoute.
- Test login with backend.

### Phase 3: Dashboard

- Create dashboardService.
- Create DashboardPage.
- Create DashboardStats.
- Connect to `/api/dashboard/summary`.

### Phase 4: Residents CRUD

- Create residentService.
- Create ResidentsPage.
- Create ResidentTable.
- Create ResidentForm.
- Create ResidentCreatePage.
- Create ResidentEditPage.
- Create ResidentDetailPage.

### Phase 5: Prediction Flow

- Create predictionService.
- Add classify button on resident detail or resident table.
- Show PredictionResult.
- Show recommendation and early warning.

### Phase 6: Reports

- Create reportService.
- Create ReportsPage.
- Create ReportTable.
- Create ReportDetailPage.
- Create ReportDetail.

### Phase 7: UI Polish

- Improve spacing.
- Improve responsive layout.
- Add badges.
- Add loading and empty states.
- Check labels.
- Remove unused code.

### Phase 8: Final Integration Test

- npm run build.
- Test all routes.
- Test API token behavior.
- Test with backend running.
- Make sure no out-of-scope features exist.

---

## Definition of Done

Frontend is complete when:
- It runs with `npm run dev`.
- It builds with `npm run build`.
- It can login to backend.
- It stores token.
- It protects dashboard routes.
- It can create resident data.
- It can edit resident data.
- It can delete resident data.
- It can classify resident data.
- It displays predicted class.
- It displays BMI.
- It displays recommendation.
- It displays early warning.
- It displays reports.
- It has clean layout.
- It follows pages -> fragments -> elements structure.
- It does not include features outside thesis scope.
