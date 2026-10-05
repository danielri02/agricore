from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field

from app.models.enums import EquipmentStatus

class EquipmentBase(BaseModel):
    serial_number: str = Field(min_length=1,max_length=30)
    model: str = Field(min_length=1,max_length=30)
    fuel_level: Decimal = Field(ge=0,le=100)
    status: EquipmentStatus
    farm_id: int

class EquipmentCreate(EquipmentBase):
    pass

class EquipmentRead(EquipmentBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

class EquipmentReliabilityRatio(BaseModel):
    equipment_model: str
    completed_job: int
    failed_job: int
    reliability_ratio: Decimal | None
