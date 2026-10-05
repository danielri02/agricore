
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey, Integer, String
from app.models.base import Base

from typing import TYPE_CHECKING
if TYPE_CHECKING:
    from app.models import Equipment, Operator
from app.models import Base

class Farm(Base):
    __tablename__ = "farms"

    MAINTENANCE_THRESHOLD = 30

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(30),nullable=False)
    region: Mapped[str] = mapped_column(String(30),nullable=False)
    capacity: Mapped[int] = mapped_column(Integer,nullable=False)
    supervisor_id: Mapped[int] = mapped_column(Integer,nullable=False)

    equipment: Mapped[list[Equipment]] = relationship(back_populates="farm")
    operators: Mapped[list[Operator]] = relationship(back_populates="farm")

