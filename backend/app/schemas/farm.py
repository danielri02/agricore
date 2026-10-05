from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field


class FarmBase(BaseModel):
    name: str = Field(min_length=1, max_length=30)
    region: str = Field(min_length=1, max_length=30)
    capacity: int
    supervisor_id: int

class FarmCreate(FarmBase):
    pass

class FarmRead(FarmBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

class MaintenanceFlag(BaseModel):
    farm_id: int
    pct_maintenance: Decimal = Field(ge=0, le=100)
