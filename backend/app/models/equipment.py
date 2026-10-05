from decimal import Decimal

from sqlalchemy import CheckConstraint, ForeignKey, Integer, Numeric, String, Enum as SqlEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship

from typing import TYPE_CHECKING
if TYPE_CHECKING:
    from app.models import Farm, Job
from app.models import Base, EquipmentStatus


class Equipment(Base):
    __tablename__ = "equipment"
    __table_args__ = (
        CheckConstraint("fuel_level BETWEEN 0 AND 100", name="fuel_level_range"),
    )

    LOW_FUEL_THRESHOLD = 20

    id: Mapped[int] = mapped_column(primary_key=True)
    serial_number: Mapped[str] = mapped_column(String(30),nullable=False,unique=True)
    model: Mapped[str] = mapped_column(String(30),nullable=False)
    fuel_level: Mapped[Decimal] = mapped_column(Numeric(5,2),nullable=False)
    farm_id: Mapped[int] = mapped_column(Integer, ForeignKey("farms.id"), nullable=False)
    status: Mapped[EquipmentStatus] = mapped_column(SqlEnum(
        EquipmentStatus,
        name="equipment_status",
        values_callable=lambda enums: enums.values()
    ))
    farm_id : Mapped[int] = mapped_column(Integer, ForeignKey("farms.id"),nullable=False)
    farm: Mapped[Farm] = relationship(back_populates="equipment")
    jobs : Mapped[list[Job]] = relationship(back_populates="equipment")
