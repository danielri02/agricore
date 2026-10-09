from typing import Literal

from fastapi import APIRouter, Depends, File, Query, UploadFile, status

from app.models import Report
from app.models.user import User
from app.security.role import get_current_user, require_role
from app.models.enums import UserRole
from app.schemas.report import ReportCreate, ReportRead
from app.schemas.pagination import PaginatedRead
from app.database.crud import delete_data, get_data, get_data_paginated, put_data
from app.database.bucket import s3_link, s3_upload
from app.database.session import AsyncSessionLocal

router = APIRouter(prefix="/reports")


@router.get("", response_model=list[ReportRead])
async def get_reports(_: User = Depends(get_current_user)):
    reports = await get_data(Report)
    for report in reports:
        report.file_url = s3_link(report.file_url)
    return reports

@router.get("/paginated", response_model=PaginatedRead[ReportRead])
async def get_reports_paginated(
    page: int = Query(0),
    page_size: int = Query(20),
    filter_by: str | None = Query(None),
    sort_by: str | None = Query(None),
    sort_dir: Literal["asc", "desc"] | None = Query(None),
    _: User = Depends(get_current_user),
):
    return await get_data_paginated(Report, page, page_size, filter_by, sort_by, sort_dir)

@router.post("", response_model=ReportRead, status_code=status.HTTP_201_CREATED)
async def upload_file(
    file: UploadFile = File(...),
    _: User = Depends(require_role(UserRole.ADMIN, UserRole.OPERATOR)),
):
    key = s3_upload(file)
    async with AsyncSessionLocal() as db:
        report = Report(file_url=key)
        db.add(report)
        await db.commit()
    return report

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
