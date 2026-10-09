
import os
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from mangum import Mangum
from sqlalchemy.exc import IntegrityError

from app.routes import farms
from app.routes import auth, equipment, jobs, operators
from app.routes import reports
from app.routes import health


app = FastAPI(
    title="AgriCore",
    description="AgriCore Operations Command",
    version="0.1.0"
)

FRONTEND_ORIGIN = os.environ.get("FRONTEND_ORIGIN", "http://localhost:5173")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_ORIGIN, "https://d323f6x8odqgyu.cloudfront.net", "http://localhost:4173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(farms.router)
app.include_router(operators.router)
app.include_router(equipment.router)
app.include_router(jobs.router)
app.include_router(reports.router)
app.include_router(auth.router)
app.include_router(health.router)



@app.exception_handler(IntegrityError)
async def integrity_error_handler(request:Request,exc:IntegrityError) -> JSONResponse:
    return JSONResponse(
        {"detail":"A database constraint was violated"}, status_code=409
    )

@app.exception_handler(Exception)
async def unhandled_exception_handler(request:Request,exc:Exception) -> JSONResponse:
    return JSONResponse(
        {"detail":"An unexpected error has occurred"}, status_code=500
    )

handler = Mangum(app, lifespan="off")
