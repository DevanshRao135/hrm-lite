# HRMS Lite

## Project Overview

HRMS Lite is a lightweight employee and attendance management application with a React frontend and a FastAPI backend.

Current features include:
- employee creation, listing, and soft deletion
- attendance marking by employee ID
- employee-wise attendance history
- present-day summaries in the employee table
- attendance filtering for `All Time`, `This Week`, and `This Month`

The frontend provides a small HR dashboard experience, while the backend exposes REST APIs backed by MongoDB.

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
- Uvicorn

## Project Structure

```text
hrms-lite/
├── backend/
│   ├── app/
│   └── requirements.txt
├── frontend/
│   ├── src/
│   └── package.json
└── README.md
```

## Steps To Run The Project Locally

### Prerequisites

Make sure you have the following installed:
- Python 3.10+ recommended
- Node.js 18+ recommended
- MongoDB running locally on the default port

By default, the backend uses:

```env
MONGO_URI=mongodb://localhost:27017
```

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
- CORS is enabled for:
  - `http://localhost:5173`
  - `http://127.0.0.1:5173`
- MongoDB data is stored in the `hrms_db` database by default.

## Assumptions Or Limitations

- Attendance `date` is currently stored as a string, not a native date type.
- Attendance `status` is stored as text, so consistent values such as `Present` and `Absent` are assumed.
- Present-day summaries are basic and intended for small-to-medium datasets.
- Employee deletion is a soft delete using `is_active = False`.
- There is no authentication or role-based access control yet.
- There are no automated tests included yet.
- Reporting is limited to table summaries and employee-specific attendance history.
- The frontend assumes the backend is running locally with the default API base URL.

## Future Improvement Ideas

- convert attendance dates to a proper date/datetime type
- add authentication and role management
- add richer dashboard KPIs and charts
- support CSV/PDF export
- add automated tests for frontend and backend
- add leave, holiday, and weekend-aware attendance rules
