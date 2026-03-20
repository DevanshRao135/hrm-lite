from app.models.employee import Employee
from app.models.attendance import Attendance
from datetime import date, timedelta


def _get_date_range(range_type: str):
    today = date.today()

    if range_type == "this_week":
        start_date = today - timedelta(days=today.weekday())
        end_date = start_date + timedelta(days=6)
        return start_date.isoformat(), end_date.isoformat()

    if range_type == "this_month":
        start_date = today.replace(day=1)
        if start_date.month == 12:
            next_month = start_date.replace(year=start_date.year + 1, month=1)
        else:
            next_month = start_date.replace(month=start_date.month + 1)
        end_date = next_month - timedelta(days=1)
        return start_date.isoformat(), end_date.isoformat()

    return None, None

async def create_employee(data):
    existing = await Employee.find_one(
        {"$or": [{"employee_id": data.employee_id}, {"email": data.email}]}
    )
    if existing:
        raise ValueError("Employee already exists")

    emp = Employee(**data.dict())
    await emp.insert()
    return emp


async def get_employees(range_type: str = "all"):
    employees = await Employee.find({"is_active": True}).to_list()

    if not employees:
        return []

    employee_ids = [employee.employee_id for employee in employees]
    start_date, end_date = _get_date_range(range_type)
    match_query = {
        "employee_id": {"$in": employee_ids},
        "status": {"$regex": "^present$", "$options": "i"}
    }
    if start_date and end_date:
        match_query["date"] = {"$gte": start_date, "$lte": end_date}

    attendance_collection = Attendance.get_pymongo_collection()
    present_days_cursor = attendance_collection.aggregate(
        [
            {
                "$match": match_query
            },
            {
                "$group": {
                    "_id": "$employee_id",
                    "total_present_days": {"$sum": 1}
                }
            }
        ]
    )
    present_days = await present_days_cursor.to_list(length=None)

    present_days_by_employee = {
        item["_id"]: item["total_present_days"] for item in present_days
    }

    return [
        {
            **employee.model_dump(mode="json"),
            "total_present_days": present_days_by_employee.get(employee.employee_id, 0)
        }
        for employee in employees
    ]

async def get_employee(employee_id: str):
    return await Employee.find_one({"employee_id": employee_id, "is_active": True})


async def delete_employee(employee_id: str):
    emp = await Employee.find_one({"employee_id": employee_id})
    if not emp:
        return None
    emp.is_active = False
    await emp.save()
    return emp
