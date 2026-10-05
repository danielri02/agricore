

from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine
from .config import DB_URL_ASYNC

engine = create_async_engine(DB_URL_ASYNC, echo=True)
AsyncSessionLocal = async_sessionmaker(engine,expire_on_commit=False)