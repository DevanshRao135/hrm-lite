from fastapi import APIRouter, HTTPException, Query
from app.schemas.employee import EmployeeCreate
from app.services.employee_service import *

router = APIRouter()

@router.post("/")
async def create(emp: EmployeeCreate):
    try:
        return await create_employee(emp)
    except ValueError as e:
        raise HTTPException(status_code=409, detail=str(e))

@router.get("")
@router.get("/")
async def list_all(range_type: str = Query(default="all", alias="range")):
    return await get_employees(range_type=range_type)


@router.delete("/{employee_id}")
async def delete(employee_id: str):
    emp = await delete_employee(employee_id)
    if not emp:
        raise HTTPException(status_code=404, detail="Not found")
    return {"message": "Deleted"}


@router.get("/{employee_id}")
async def get(employee_id: str):
    emp = await get_employee(employee_id)
    if not emp:
        raise HTTPException(status_code=404, detail="Not found")
    return emp
