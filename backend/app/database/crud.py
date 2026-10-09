import json
from typing import Literal

from fastapi import HTTPException
from pydantic import BaseModel
from sqlalchemy import delete, func, select

from app.database.session import AsyncSessionLocal


async def get_data(model:type):
    async with AsyncSessionLocal() as db:
        statement = select(model).order_by(model.id)
        result = await db.scalars(statement)
    return list(result)
    # return list(result.scalars().all())


async def get_data_paginated(
    model: type,
    page: int = 0,
    page_size: int = 25,
    filter_by: str | None = None,
    sort_by: str | None = None,
    sort_dir: Literal["asc", "desc"] | None = None,
):
    async with AsyncSessionLocal() as db:
        statement = select(model)
        if filter_by:
            filter_dict = json.loads(filter_by)
            statement = statement.where(
                getattr(model, filter_dict["field"]) == filter_dict["value"]
            )
        total = await db.scalar(select(func.count()).select_from(statement.subquery()))
        if sort_by:
            column = getattr(model, sort_by)
            statement = statement.order_by(
                column.desc() if sort_dir == "desc" else column.asc()
            )
        statement = statement.offset(page * page_size).limit(page_size)
        result = await db.scalars(statement)
    return {"items": list(result), "total": total}


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
