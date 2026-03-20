# HRMS Lite

## Project Overview

HRMS Lite is a lightweight employee and attendance management application built with a React frontend and a FastAPI backend.

Current features include:
- employee creation, listing, and soft deletion
- attendance marking by employee ID
- employee-wise attendance history
- present-day summaries in the employee table
- attendance filtering for `All Time`, `This Week`, and `This Month`

The frontend provides a compact HR dashboard experience, while the backend exposes REST APIs backed by MongoDB.

## Tech Stack Used

### Frontend
- React 19
- Vite
- Material UI (`@mui/material`, `@mui/icons-material`, `@mui/x-data-grid`)
- React Router
- TanStack React Query
- Axios
- React Calendar

### Backend
- FastAPI
- Beanie ODM
- Motor
- MongoDB
- Pydantic
- python-dotenv
- Uvicorn

## Project Structure

```text
hrms-lite/
|-- backend/
|   |-- app/
|   |-- .env
|   `-- requirements.txt
|-- frontend/
|   |-- src/
|   `-- package.json
`-- README.md
```

## Environment Variables

### Backend

Create `backend/.env` with:

```env
MONGO_URI=mongodb://localhost:27017
```

For Railway MongoDB, use Railway's public MongoDB connection string instead of a `railway.internal` hostname.

### Frontend

Create `frontend/.env` with:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api
VITE_APP_NAME=HRMS Lite
VITE_ENABLE_MOCKS=false
```

Notes:
- `VITE_API_BASE_URL` controls the backend API URL used by the frontend
- `VITE_APP_NAME` controls app branding in the UI
- `VITE_ENABLE_MOCKS` is available as a future mock/dev-only toggle
- `VITE_NODE_ENV` is not needed because Vite already exposes mode information through `import.meta.env`
- use an `https://...` API URL in production to avoid mixed-content errors on Netlify or other HTTPS hosts

## Steps To Run The Project Locally

### Prerequisites

Make sure you have the following installed:
- Python 3.10+ recommended
- Node.js 18+ recommended
- MongoDB running locally on the default port, or a hosted MongoDB instance such as Railway MongoDB

### Backend Environment Setup

The backend reads `MONGO_URI` from `backend/.env`.

Example local MongoDB configuration:

```env
MONGO_URI=mongodb://localhost:27017
```

Example Railway MongoDB configuration:

```env
MONGO_URI=mongodb://mongo:YOUR_PASSWORD@YOUR_PUBLIC_RAILWAY_HOST:YOUR_PORT
```

Note:
- use Railway's public connection string when running locally
- do not use `railway.internal` hostnames from your local machine

### Frontend Environment Setup

The frontend reads the API base URL from `frontend/.env`.

Example configuration:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api
VITE_APP_NAME=HRMS Lite
VITE_ENABLE_MOCKS=false
```

Notes:
- `VITE_APP_NAME` is used for frontend branding, such as the navbar title
- `VITE_ENABLE_MOCKS` is available as a future toggle for mock/dev-only API behavior
- `VITE_NODE_ENV` is not required because Vite already provides mode information through `import.meta.env`
- for production deployments, set `VITE_API_BASE_URL` to your deployed backend URL, for example `https://your-backend-domain/api`

### 1. Start the Backend

Open a terminal in the `backend` folder:

```powershell
cd backend
```

Create and activate a virtual environment if needed:

```powershell
python -m venv venv
.\venv\Scripts\activate
```

Install backend dependencies:

```powershell
pip install -r requirements.txt
```

Create `backend/.env` if it does not already exist:

```env
MONGO_URI=mongodb://localhost:27017
```

Or, if you want to use Railway MongoDB locally, place your public Railway MongoDB URI in `backend/.env`.

Run the FastAPI server:

```powershell
uvicorn app.main:app --reload
```

The backend will run at:

```text
http://127.0.0.1:8000
```

### 2. Start the Frontend

Open another terminal in the `frontend` folder:

```powershell
cd frontend
```

Install frontend dependencies:

```powershell
npm install
```

Create `frontend/.env` if it does not already exist:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api
VITE_APP_NAME=HRMS Lite
VITE_ENABLE_MOCKS=false
```

Start the Vite development server:

```powershell
npm run dev
```

The frontend will run at:

```text
http://127.0.0.1:5173
```

### 3. Open the App

Open:

```text
http://127.0.0.1:5173
```

## API / Runtime Notes

- The frontend is currently configured to call the backend at `http://127.0.0.1:8000/api`.
- The frontend API base URL is controlled through `VITE_API_BASE_URL`.
- The frontend app title is controlled through `VITE_APP_NAME`.
- The frontend mock toggle is available through `VITE_ENABLE_MOCKS`.
- Frontend collection requests use trailing-slash paths such as `/employees/` and `/attendance/` to match the FastAPI route definitions.
- CORS is enabled for:
  - `http://localhost:5173`
  - `http://127.0.0.1:5173`
- MongoDB data is stored in the `hrms_db` database by default.
- The backend should be started from the `backend` directory so `backend/.env` is loaded correctly.

## Assumptions Or Limitations

- Attendance `date` is currently stored as a string, not a native date type.
- Attendance `status` is stored as text, so consistent values such as `Present` and `Absent` are assumed.
- Present-day summaries are basic and intended for small-to-medium datasets.
- Employee deletion is a soft delete using `is_active = False`.
- There is no authentication or role-based access control yet.
- There are no automated tests included yet.
- Reporting is limited to table summaries and employee-specific attendance history.
- The frontend assumes the backend is running locally with the default API base URL.
- Railway internal/private MongoDB hostnames do not work directly from a local machine; a public connection string is required for local access.
- CORS currently allows the local Vite origins; production frontend origins would need to be added in backend configuration.

## Future Improvement Ideas

- convert attendance dates to a proper date/datetime type
- add authentication and role management
- add richer dashboard KPIs and charts
- support CSV/PDF export
- add automated tests for frontend and backend
- add leave, holiday, and weekend-aware attendance rules
