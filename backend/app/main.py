from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.database import init_db
from app.models.employee import Employee
from app.models.attendance import Attendance
from app.routes import employee_routes, attendance_routes

app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def on_startup():
    try:
        await init_db([Employee, Attendance])
        print("DB connected successfully")
    except Exception as e:
        print("DB connection failed:", e)

app.include_router(employee_routes.router, prefix="/api/employees")
app.include_router(attendance_routes.router, prefix="/api/attendance")