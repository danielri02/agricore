import os

# DB_URL_ASYNC = os.environ.get(
#     "DB_URL_ASYNC", "postgresql+asyncpg://postgres:postgres@localhost:5432/agricore"
# )
# DB_URL_SYNC = os.environ.get(
#     "DB_URL_SYNC", "postgresql://postgres:postgres@localhost:5432/agricore"
# )

DB_URL_ASYNC = "postgresql+asyncpg://postgres:postgres@postgres-agricore.cnseksays991.us-east-2.rds.amazonaws.com:5432/agricore"
DB_URL_SYNC = "postgresql://postgres:postgres@postgres-agricore.cnseksays991.us-east-2.rds.amazonaws.com:5432/agricore"
