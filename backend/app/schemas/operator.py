
from pydantic import BaseModel, ConfigDict, Field


class OperatorBase(BaseModel):
    name: str = Field(min_length=1, max_length=30)
    farm_id: int

class OperatorCreate(OperatorBase):
    pass

class OperatorRead(OperatorBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

class ReportingLine(BaseModel):
    supervisor_id: int
    operator_count: int
