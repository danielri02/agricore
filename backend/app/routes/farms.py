from fastapi import APIRouter, Depends, Query, status
from sqlalchemy import case, func, select

from app.schemas.farm import FarmCreate, FarmRead, MaintenanceFlag
from app.database.session import AsyncSessionLocal
from app.models import Farm, Equipment, EquipmentStatus
from app.models.user import User
from app.security.role import get_current_user, require_role
from app.models.enums import UserRole
from app.database.crud import delete_data, get_data, post_data, put_data

router = APIRouter(prefix="/farms")


@router.get("", response_model=list[FarmRead])
async def get_farms(_: User = Depends(get_current_user)):
    return await get_data(Farm)

@router.post("",response_model=list[FarmRead],status_code=status.HTTP_201_CREATED)
async def post_farms(body: list[FarmCreate], _: User = Depends(require_role(UserRole.ADMIN))):
    return await post_data(Farm, body) # type: ignore

@router.put("/{farm_id:int}", response_model=FarmRead)
async def put_farm(farm_id: int, body: FarmCreate, _: User = Depends(require_role(UserRole.ADMIN))):
    return await put_data(Farm, farm_id, body)

@router.delete("", response_model=dict[str, int])
async def delete_farm(ids:list[int] = Query(), _: User = Depends(require_role(UserRole.ADMIN))):
    return await delete_data(Farm,ids)

@router.get("/maintenance-flags", response_model=list[MaintenanceFlag])
async def maintenace_flags(_: User = Depends(get_current_user)):
    async with AsyncSessionLocal() as db:
        pct_maintenance = func.avg(
            case(
                (Equipment.status == EquipmentStatus.MAINTENANCE, 100.0),
                else_=0.0,
            )
        )
        statement = (
            select(
                Equipment.farm_id,
                pct_maintenance.label("pct_maintenance"),
            )
            .group_by(Equipment.farm_id)
            .having(pct_maintenance > Farm.MAINTENANCE_THRESHOLD)
        )
        result = await db.execute(statement)
    return list(result.mappings().all())
