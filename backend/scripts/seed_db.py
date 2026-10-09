import asyncio
from math import log, sqrt
import random
from random import randint
from app.database.session import AsyncSessionLocal

from app.models import Farm, Operator, Equipment
from app.models.enums import EquipmentStatus, JobPriority, JobStatus, UserRole
from app.models.job import Job
from app.models.report import Report
from datetime import datetime, timezone
from app.models.user import User
from app.security.password import hash_password

date_start = int(datetime(2000, 1, 1, tzinfo=timezone.utc).timestamp())
date_end = int(datetime.now(timezone.utc).timestamp())


random.seed(2478)

def randchars(n: int = 1):
    return "".join([chr(ord("A") + randint(0, 25)) for _ in range(n)])

def randdigits(n: int = 1):
    return "".join([str(randint(0, 9)) for _ in range(n)])

def randselect(values: list):
    return values[randint(0, len(values) - 1)]


async def seed_db(n_equipment: int = 500):
    n_regions = int(log(n_equipment))
    n_farms = int(n_equipment // 20)
    n_operators = int(n_equipment // 2)
    n_models = int(2 * log(n_equipment))
    n_jobs = int(n_equipment)

    regions = list(set(randchars(2) for _ in range(n_regions)))
    farms = list(set(f"{randchars(5)} Farm" for _ in range(n_farms)))
    models = list(set(f"{randchars(1)}{randdigits(2)}" for _ in range(n_models)))
    operators = list(set(randchars(5) for _ in range(n_operators)))
    equipment = list(set(f"{randchars(3)}-{randdigits(3)}" for _ in range(n_equipment)))
    jobs = list(set(f"{randchars(6)} Job" for _ in range(n_jobs)))

    async with AsyncSessionLocal.begin() as session:
        session.add_all(
            Farm(
                name=f_name,
                region=randselect(regions),
                capacity=randint(1, 100),
                supervisor_id=randint(1, n_regions * 2),
            )
            for f_name in farms
        )

        session.add_all(
            Operator(name=t_name, farm_id=randint(1, len(farms)))
            for t_name in operators
        )

        session.add_all(
            Equipment(
                serial_number=sn,
                model=randselect(models),
                fuel_level=hash(sn) % 101,
                farm_id=randint(1, len(farms)),
                status=(
                    randselect(
                        (3 * [EquipmentStatus.IDLE])
                        + [EquipmentStatus.IN_USE, EquipmentStatus.RETIRED, EquipmentStatus.MAINTENANCE]
                    )
                ),
            )
            for sn in equipment
        )

        session.add_all(
            Job(
                title=j_title,
                equipment_id=randint(1, len(equipment)),
                operator_id=randint(1, len(operators)),
                priority=randselect(JobPriority.values()),
                status=randselect(JobStatus.values()),
            )
            for j_title in jobs
        )

        # session.add_all(
        #     Report(
        #         job_id=randint(1, len(jobs)),
        #         file_url="aws.com/"+str(i),
        #         notes=f"{randchars(5)} {randchars(5)} {randchars(5)}",
        #         timestamp=datetime.fromtimestamp(randint(date_start,date_end))
        #     )
        #     for i in range(len(jobs))
        # )

        session.add_all(
            [
                User(username="admin", hashed_password=hash_password("admin"), role=UserRole.ADMIN),
                User(username="operator", hashed_password=hash_password("operator"), role=UserRole.OPERATOR),
                User(username="auditor", hashed_password=hash_password("auditor"), role=UserRole.AUDITOR),
            ]
        )


if __name__ == "__main__":
    asyncio.run(seed_db())
