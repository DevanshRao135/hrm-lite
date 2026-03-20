from pydantic import BaseModel

class AttendanceCreate(BaseModel):
    employee_id: str
    date: str
    status: str
    comment: str | None = None