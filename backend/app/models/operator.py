
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey, Integer, String

from typing import TYPE_CHECKING
if TYPE_CHECKING:
    from app.models import Farm, Job
from app.models import Base


class Operator(Base):
    __tablename__ = "operators"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(30),nullable=False)
    farm_id:Mapped[int] = mapped_column(Integer,ForeignKey("farms.id"),nullable=False)

    farm: Mapped[Farm] = relationship(back_populates="operators")
    jobs: Mapped[list[Job]] = relationship(back_populates="operator")
