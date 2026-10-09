from datetime import datetime, timedelta, timezone
import hashlib
import secrets

from fastapi import HTTPException
from sqlalchemy import select, update

from app.database.session import AsyncSessionLocal
from app.models.refresh import RefreshLog

REFRESH_TOKEN_EXPIRY_MINUTES = 3


async def create_refresh(user_id: int, chain_id: str | None):
    refresh_token = secrets.token_urlsafe(32)
    refresh_hash = hashlib.sha256(refresh_token.encode()).hexdigest()
    now = datetime.now(timezone.utc)
    async with AsyncSessionLocal() as db:
        db.add(
            RefreshLog(
                id=refresh_hash,
                chain_id=chain_id or refresh_hash,
                user_id=user_id,
                issued_at=now,
                expiration=now + timedelta(minutes=REFRESH_TOKEN_EXPIRY_MINUTES)
            )
        )
        await db.commit()

    return refresh_token


async def check_refresh(refresh_token: str):
    refresh_hash = hashlib.sha256(refresh_token.encode()).hexdigest()
    async with AsyncSessionLocal() as db:
        log = await db.get(RefreshLog, refresh_hash)
        if log is None:
            raise HTTPException(401, detail="Invalid refresh token")
        if log.revoked or log.expiration <= datetime.now(timezone.utc):
            statement = update(RefreshLog).where(RefreshLog.chain_id == log.chain_id).values(revoked=True)
            await db.execute(statement)
            await db.commit()
            raise HTTPException(401,detail="Invalid refresh token")
        log.revoked = True
        await db.commit()
    return log.user_id, log.chain_id

