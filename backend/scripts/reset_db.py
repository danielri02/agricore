from sqlalchemy import create_engine
from app.database.config import DB_URL_SYNC
from app.models import Base


def reset_db():
    engine = create_engine(DB_URL_SYNC, echo=True)
    Base.metadata.drop_all(engine)
    Base.metadata.create_all(engine)
    engine.dispose()


if __name__ == "__main__":
    reset_db()
