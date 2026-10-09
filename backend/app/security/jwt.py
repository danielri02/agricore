
import os
from datetime import datetime, timedelta, timezone
import jwt

SECRET_KEY = os.environ.get("SECRET_KEY", "not_secret")
ALGORITHM = "HS256"
TOKEN_EXPIRE_MINUTES = 1


def create_token(data: dict, expires_delta: timedelta | None = None) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (
        expires_delta or timedelta(minutes=TOKEN_EXPIRE_MINUTES)
    )
    to_encode["exp"] = expire
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def decode_token(token: str) -> dict:
    return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
