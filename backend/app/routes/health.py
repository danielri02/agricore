


import boto3
from botocore.exceptions import ClientError
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.exc import SQLAlchemyError

from app.database.session import AsyncSessionLocal
from app.models.enums import UserRole
from app.models.user import User
from app.security.role import require_role
from app.database.bucket import BUCKET_NAME


router = APIRouter(prefix="/health")

@router.get("")
async def health_get():
    return {"status":"ok"}

@router.get("/ready")
async def health_ready_get():
    async with AsyncSessionLocal() as db:
        try:
            result = await db.scalar(select(1))
        except SQLAlchemyError:
            raise HTTPException(503,detail="Failed to connect to the database")
    return {"status":"ok"}

@router.get("/detail")
async def health_detail_get(_: User = Depends(require_role(UserRole.ADMIN))):
    status = {}
    async with AsyncSessionLocal() as db:
        try:
            result = await db.scalar(select(1))
            status["database"] = "ok"
        except SQLAlchemyError:
            status["database"] = "fail"

    try:
        s3 = boto3.client("s3")
        s3.head_bucket(Bucket=BUCKET_NAME)
        status["s3"] = "ok"
    except ClientError:
        status["s3"] = "fail"

    return status


