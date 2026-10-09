import json
from typing import Literal

from fastapi import APIRouter, Depends, HTTPException, Query,status
from sqlalchemy import select, func, case

from app.schemas.equipment import EquipmentCreate, EquipmentRead, EquipmentReliabilityRatio
from app.database.session import AsyncSessionLocal
from app.models import Equipment, EquipmentStatus
from app.models.enums import JobStatus, UserRole
from app.models.job import Job
from app.models.user import User
from app.security.role import get_current_user, require_role
from app.database.crud import delete_data, get_data, get_data_paginated, post_data, put_data
from app.schemas.pagination import PaginatedRead


router = APIRouter(prefix="/equipment")


@router.get("", response_model=list[EquipmentRead])
async def get_equipment(_: User = Depends(get_current_user)):
    return await get_data(Equipment)


@router.get("/paginated", response_model=PaginatedRead[EquipmentRead])
async def get_equipment_paginated(
    page: int = Query(0),
    page_size: int = Query(20),
    filter_by: str | None = Query(None),
    sort_by: str | None = Query(None),
    sort_dir: Literal["asc", "desc"] | None = Query(None),
    _: User = Depends(get_current_user),
):
    return await get_data_paginated(Equipment, page, page_size, filter_by, sort_by, sort_dir)


@router.post("",response_model=list[EquipmentRead],status_code=status.HTTP_201_CREATED)
async def post_equipment(body: list[EquipmentCreate], _: User = Depends(require_role(UserRole.ADMIN))):
    return await post_data(Equipment, body)  # type: ignore

@router.put("/{equipment_id:int}", response_model=EquipmentRead)
async def put_equipment(equipment_id: int, body: EquipmentCreate, _: User = Depends(require_role(UserRole.ADMIN))):
    return await put_data(Equipment, equipment_id, body)

@router.delete("", response_model=dict[str, int])
async def delete_equipment(ids: list[int] = Query(), _: User = Depends(require_role(UserRole.ADMIN))):
    return await delete_data(Equipment, ids)


@router.get("/low-fuel-alerts", response_model=list[EquipmentRead])
async def low_fuel_alerts(_: User = Depends(get_current_user)):
    async with AsyncSessionLocal() as db:
        statement = (
            select(Equipment)
            .where(
                Equipment.status != EquipmentStatus.RETIRED
                and Equipment.fuel_level < Equipment.LOW_FUEL_THRESHOLD
            )
            .order_by(Equipment.id)
        )
        result = await db.execute(statement)
    return list(result.scalars().all())

@router.get("/reliability-ratios", response_model=list[EquipmentReliabilityRatio])
async def reliability_ratios(_: User = Depends(get_current_user)):
    async with AsyncSessionLocal() as db:
        completed_job = func.sum(
            case(
                (Job.status == JobStatus.COMPLETED, 1),
                else_=0,
            )
        )
        failed_job = func.sum(
            case(
                (Job.status == JobStatus.FAILED, 1),
                else_=0,
            )
        )
        statement = (
            select(
                Equipment.model.label("equipment_model"),
                completed_job.label("completed_job"),
                failed_job.label("failed_job"),
                case((failed_job > 0, completed_job / failed_job), else_=None).label("reliability_ratio"),
            )
            .select_from(Equipment)
            .outerjoin(Job, Job.equipment_id == Equipment.id)
            .group_by(Equipment.model)
            .order_by(Equipment.model)
        )
        result = await db.execute(statement)
    return list(result.mappings().all())
