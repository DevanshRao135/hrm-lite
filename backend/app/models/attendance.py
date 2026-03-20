from beanie import Document
from datetime import datetime

class Attendance(Document):
    employee_id: str
    date: str  # store ISO internally if needed
    status: str
    comment: str | None = None
    created_at: datetime = datetime.utcnow()
    updated_at: datetime = datetime.utcnow()

    class Settings:
        name = "attendance"
        indexes = [
            [("employee_id", 1), ("date", 1)]
        ]