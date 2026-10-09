from pydantic import BaseModel


class PaginatedRead[T](BaseModel):
    items: list[T]
    total: int
