
from typing import Literal

from fastapi import APIRouter, Depends, Query,status
from sqlalchemy import func, select

from app.database.session import AsyncSessionLocal
from app.models import Operator
from app.schemas.operator import ReportingLine, OperatorCreate, OperatorRead
from app.schemas.pagination import PaginatedRead
from app.models.farm import Farm
from app.models.enums import JobStatus, UserRole
from app.models.job import Job
from app.models.user import User
from app.security.role import get_current_user, require_role
from app.database.crud import delete_data, get_data, get_data_paginated, post_data, put_data

router = APIRouter(prefix="/operators")


@router.get("", response_model=list[OperatorRead])
async def get_operators(_: User = Depends(get_current_user)):
    return await get_data(Operator)

@router.get("/paginated", response_model=PaginatedRead[OperatorRead])
async def get_operators_paginated(
    page: int = Query(0),
    page_size: int = Query(20),
    filter_by: str | None = Query(None),
    sort_by: str | None = Query(None),
    sort_dir: Literal["asc", "desc"] | None = Query(None),
    _: User = Depends(get_current_user),
):
    return await get_data_paginated(Operator, page, page_size, filter_by, sort_by, sort_dir)



@router.post("", response_model=list[OperatorRead], status_code=status.HTTP_201_CREATED)
async def post_operators(body: list[OperatorCreate],_: User = Depends(require_role(UserRole.ADMIN))):
    return await post_data(Operator, body)  # type: ignore

@router.put("/{operator_id:int}", response_model=OperatorRead)
async def put_operator(operator_id: int, body: OperatorCreate,_: User = Depends(require_role(UserRole.ADMIN))):
    return await put_data(Operator, operator_id, body)

@router.delete("", response_model=dict[str, int])
async def delete_operators(ids: list[int] = Query(), _: User = Depends(require_role(UserRole.ADMIN))):
    return await delete_data(Operator, ids)


@router.get("/reporting-lines", response_model=list[ReportingLine])
async def get_reporting_lines(_: User = Depends(get_current_user)):
    async with AsyncSessionLocal() as db:
        statement = (
            select(
                Farm.supervisor_id.label("supervisor_id"),
                func.count(Operator.id.distinct()).label("operator_count")
            )
            .select_from(Job)
            .join(Operator, Job.operator_id == Operator.id)
            .join(Farm, Farm.id == Operator.farm_id)
            .where(
                (
                    Job.status == JobStatus.IN_PROGRESS
                    or Job.status == JobStatus.PENDING
                )
            )
            .group_by(Farm.supervisor_id)
            .order_by(Farm.supervisor_id)
        )
        result = await db.execute(statement)
    return list(result.mappings().all())

