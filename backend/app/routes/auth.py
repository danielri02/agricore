from fastapi import APIRouter, Depends, HTTPException, Query,status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy import func, select

from app.schemas.user import UserCreate, UserRead, UserRole, Token
from app.database.session import AsyncSessionLocal
from app.models.user import User
from app.security.password import verify_password, hash_password
from app.security.jwt import create_token
from app.security.role import require_role
from app.database.crud import delete_data, get_data, post_data, put_data

router = APIRouter(prefix="/auth", tags=["auth"])


@router.get("/users", response_model=list[UserRead])
async def get_users(_: User = Depends(require_role(UserRole.ADMIN))):
    return await get_data(User)

@router.put("/users/{user_id:int}", response_model=UserRead)
async def put_user(user_id: int, body: UserCreate,_: User = Depends(require_role(UserRole.ADMIN))):
    return await put_data(User, user_id, body)

@router.delete("/users", response_model=dict[str, int])
async def delete_users(ids:list[int] = Query(), _: User = Depends(require_role(UserRole.ADMIN))):
    return await delete_data(User, ids)


@router.post("/users", response_model=UserRead, status_code=status.HTTP_201_CREATED)
async def register_user(
    body: list[UserCreate], _: User = Depends(require_role(UserRole.ADMIN))
) -> User:
    async with AsyncSessionLocal() as db:
        newUser = body[0]
        existing = await db.execute(
            select(User).where(func.lower(User.username) == newUser.username.lower())
        )
        if existing.scalar_one_or_none() is not None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Username '{newUser.username}' ",
            )
        user = User(
            username=newUser.username,
            hashed_password=hash_password(newUser.password),
            role=newUser.role,
        )
        db.add(user)
        await db.commit()
    return user


@router.post("/token", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()) -> Token:
    async with AsyncSessionLocal() as db:
        result = await db.execute(
            select(User).where(User.username == form_data.username)
        )
        user = result.scalar_one_or_none()
    if user is None or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
        )
    token = create_token(data={"sub": user.username, "role": user.role.value})
    return Token(access_token=token, token_type="bearer")
