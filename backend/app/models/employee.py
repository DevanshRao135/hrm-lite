from beanie import Document
from pydantic import EmailStr
from datetime import datetime

class Employee(Document):
    employee_id: str
    full_name: str
    email: EmailStr
    department: str
    is_active: bool = True
    created_at: datetime = datetime.utcnow()

    class Settings:
        name = "employees"
        indexes = [
            "employee_id",
            "email"
        ]