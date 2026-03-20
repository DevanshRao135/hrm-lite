from fastapi import APIRouter
from app.schemas.attendance import AttendanceCreate
from app.services.attendance_service import *

router = APIRouter()

@router.post("/")
async def mark(data: AttendanceCreate):
    result = await mark_attendance(data)
    if result == "EXISTS":
        return {"error": "Attendance already filled for today"}
    return result


@router.put("/{employee_id}/{date}")
async def update(employee_id: str, date: str, data: AttendanceCreate):
    return await update_attendance(employee_id, date, data)


@router.get("/{employee_id}")
async def get(employee_id: str):
    return await get_attendance(employee_id)