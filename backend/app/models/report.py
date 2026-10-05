from datetime import datetime

from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import DateTime, ForeignKey, Integer, String, Text, func

from typing import TYPE_CHECKING
if TYPE_CHECKING:
    from app.models import Job
from app.models import Base


class Report(Base):
    __tablename__ = "reports"

    id: Mapped[int] = mapped_column(primary_key=True)
    file_url: Mapped[str] = mapped_column(Text, nullable=True, unique=True)
    notes: Mapped[str] = mapped_column(Text, nullable=True)
    timestamp: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    job_id: Mapped[int] = mapped_column(Integer, ForeignKey("jobs.id"),nullable=True)
    job: Mapped[Job] = relationship(back_populates="reports")

