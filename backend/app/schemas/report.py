from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class ReportBase(BaseModel):
    file_url: str
    notes: str | None
    timestamp: datetime
    job_id: int | None

class ReportCreate(ReportBase):
    pass

class ReportRead(ReportBase):
    id: int
    model_config = ConfigDict(from_attributes=True)
