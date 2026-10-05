from fastapi import APIRouter, Depends, Query

from app.models import Report
from app.models.user import User
from app.security.role import get_current_user, require_role
from app.models.enums import UserRole
from app.schemas.report import ReportCreate, ReportRead
from app.database.crud import delete_data, get_data, put_data

router = APIRouter(prefix="/reports")


@router.get("", response_model=list[ReportRead])
async def get_reports(_: User = Depends(get_current_user)):
    return await get_data(Report)

@router.put("/{report_id:int}", response_model=ReportRead)
async def put_report(
    report_id: int,
    body: ReportCreate,
    _: User = Depends(require_role(UserRole.ADMIN, UserRole.OPERATOR)),
):
    return await put_data(Report, report_id, body)

@router.delete("", response_model=dict[str, int])
async def delete_reports(ids: list[int] = Query(), _: User = Depends(require_role(UserRole.ADMIN))):
    return await delete_data(Report, ids)

