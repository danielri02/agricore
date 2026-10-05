from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select

from app.database.session import AsyncSessionLocal
from app.models import Job, Equipment, Operator
from app.schemas.job import ColocationDiscrepancy, JobCreate, JobRead
from app.models.enums import UserRole
from app.models.user import User
from app.security.role import get_current_user, require_role
from app.database.crud import delete_data, get_data, post_data, put_data

router = APIRouter(prefix="/jobs")


@router.get("", response_model=list[JobRead])
async def get_jobs(_: User = Depends(get_current_user)):
    return await get_data(Job)

@router.post("", response_model=list[JobRead], status_code=status.HTTP_201_CREATED)
async def post_jobs(
    body: list[JobCreate], _: User = Depends(require_role(UserRole.ADMIN))
):
    return await post_data(Job, body)  # type: ignore

@router.put("/{job_id:int}", response_model=JobRead)
async def put_job(
    job_id: int, body: JobCreate, user: User = Depends(require_role(UserRole.ADMIN, UserRole.OPERATOR))
):
    if user.role == UserRole.OPERATOR:
        async with AsyncSessionLocal() as db:
            row = await db.get(Job, job_id)
            if row is None:
                raise HTTPException(404)
            dump = body.model_dump()
            setattr(row, "status", dump["status"])
            await db.commit()
        return row
    else:
        return await put_data(Job, job_id, body)

@router.delete("", response_model=dict[str, int])
async def delete_jobs(ids: list[int] = Query(), _: User = Depends(require_role(UserRole.ADMIN))):
    return await delete_data(Job, ids)


@router.get("/colocation-discrepancies", response_model=list[ColocationDiscrepancy])
async def get_colocation_discrepancies():
    async with AsyncSessionLocal() as db:
        statement = (
            select(
                Job.id.label("job_id"),
                Equipment.farm_id.label("equipment_farm_id"),
                Operator.farm_id.label("operator_farm_id"),
                Job.priority.label("job_priority"),
                Job.status.label("job_status"),
            )
            .join(Equipment, Equipment.id == Job.equipment_id)
            .join(Operator, Operator.id == Job.operator_id)
            .where(Equipment.farm_id != Operator.farm_id)
            .order_by(Job.id)
        )
        result = await db.execute(statement)
    return list(result.mappings().all())
