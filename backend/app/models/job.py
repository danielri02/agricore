from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey, Integer, String, Enum as SqlEnum

from typing import TYPE_CHECKING
if TYPE_CHECKING:
    from app.models import Equipment, Operator, Report
from app.models import Base,JobPriority,JobStatus


class Job(Base):
    __tablename__ = "jobs"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(30), nullable=False)
    equipment_id: Mapped[int] = mapped_column(Integer, ForeignKey("equipment.id"))
    operator_id: Mapped[int] = mapped_column(Integer, ForeignKey("operators.id"))

    priority: Mapped[JobPriority] = mapped_column(
        SqlEnum(
            JobPriority,
            name="job_priority",
            values_callable=lambda enums: JobPriority.values(),
        ),
        nullable=False
    )
    status: Mapped[JobStatus] = mapped_column(
        SqlEnum(
            JobStatus,
            name="job_status",
            values_callable=lambda enums: JobStatus.values(),
        ),
        nullable=False
    )
    equipment: Mapped[Equipment] = relationship(back_populates="jobs")
    operator: Mapped[Operator] = relationship(back_populates="jobs")
    reports: Mapped[list[Report]] = relationship(back_populates="job")
