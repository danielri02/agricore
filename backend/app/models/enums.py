
from enum import Enum

class _StrEnum(str, Enum):
    @classmethod
    def enums(cls):
        return [e for e in cls]

    @classmethod
    def values(cls):
        return [e.value for e in cls]

class EquipmentStatus(_StrEnum):
    IDLE = "Idle"
    IN_USE = "In-Use"
    MAINTENANCE = "Maintenance"
    RETIRED = "Retired"

class JobStatus(_StrEnum):
    PENDING = "Pending"
    IN_PROGRESS = "In-Progress"
    COMPLETED = "Completed"
    FAILED = "Failed"

class JobPriority(_StrEnum):
    LOW = "Low"
    MEDIUM = "Medium"
    CRITICAL = "Critical"

class UserRole(_StrEnum):
    ADMIN = "Admin"
    OPERATOR = "Operator"
    AUDITOR = "Auditor"

