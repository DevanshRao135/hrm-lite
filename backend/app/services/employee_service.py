from app.models.employee import Employee

async def create_employee(data):
    existing = await Employee.find_one(
        {"$or": [{"employee_id": data.employee_id}, {"email": data.email}]}
    )
    if existing:
        raise ValueError("Employee already exists")

    emp = Employee(**data.dict())
    await emp.insert()
    return emp


async def get_employees():
    return await Employee.find({"is_active": True}).to_list()

async def get_employee(employee_id: str):
    return await Employee.find_one({"employee_id": employee_id, "is_active": True})


async def delete_employee(employee_id: str):
    emp = await Employee.find_one({"employee_id": employee_id})
    if not emp:
        return None
    emp.is_active = False
    await emp.save()
    return emp