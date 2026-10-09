from datetime import datetime

from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, func

from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from app.models import Farm, Job
from app.models import Base, User


class RefreshLog(Base):
    __tablename__ = "refresh_log"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    chain_id: Mapped[str] = mapped_column(String(64), nullable=False)
    revoked: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)

    issued_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False,default=func.now())
    expiration: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)

    user_id:Mapped[int] = mapped_column(Integer,ForeignKey("users.id"),nullable=False)
    user: Mapped[User] = relationship()
