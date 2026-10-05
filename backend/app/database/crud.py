from fastapi import HTTPException
from pydantic import BaseModel
from sqlalchemy import delete, select

from app.database.session import AsyncSessionLocal


async def get_data(model:type):
    async with AsyncSessionLocal() as db:
        statement = select(model).order_by(model.id)
        result = await db.execute(statement)
    return list(result.scalars().all())


async def post_data(model: type, body: list[BaseModel]):
    async with AsyncSessionLocal() as db:
        rows = [model(**row.model_dump()) for row in body]
        db.add_all(rows)
        await db.commit()
    return rows


async def put_data(model: type, data_id: int, body: BaseModel):
    async with AsyncSessionLocal() as db:
        row = await db.get(model, data_id)
        if row is None:
            raise HTTPException(404)
        for k, v in body.model_dump().items():
            setattr(row, k, v)
        await db.commit()
    return row


async def delete_data(model:type, ids: list[int]):
    async with AsyncSessionLocal() as db:
        statement = delete(model).where(model.id.in_(ids))
        result = await db.execute(statement)
        await db.commit()
    return {"deleted": result.rowcount} # type: ignore

