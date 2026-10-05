
from pydantic import BaseModel, ConfigDict, Field

from app.models.enums import JobStatus, JobPriority


class JobBase(BaseModel):
    title: str = Field(min_length=1,max_length=30)
    equipment_id: int
    operator_id: int
    priority: JobPriority
    status: JobStatus


class JobCreate(JobBase):
    pass


class JobRead(JobBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

class ColocationDiscrepancy(BaseModel):
    job_id: int
    equipment_farm_id: int
    operator_farm_id: int
    job_priority: JobPriority
    job_status: JobStatus
