from app.models.attendance import Attendance

async def mark_attendance(data):
    existing = await Attendance.find_one({
        "employee_id": data.employee_id,
        "date": data.date
    })

    if existing:
        return "EXISTS"

    record = Attendance(**data.dict())
    await record.insert()
    return record


async def update_attendance(employee_id, date, data):
    record = await Attendance.find_one({
        "employee_id": employee_id,
        "date": date
    })

    if not record:
        return None

    record.status = data.status
    record.comment = data.comment
    await record.save()
    return record


async def get_attendance(employee_id):
    return await Attendance.find({"employee_id": employee_id}).to_list()