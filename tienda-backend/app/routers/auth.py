from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.schemas.user import UserCreate, UserLogin, TOTPVerify
from app.services.auth_service import AuthService
from app.middleware.auth_middleware import get_current_user
from app.models.user import User

router = APIRouter(prefix="/auth", tags=["Autenticación"])

@router.post("/register", status_code=201)
async def register(data: UserCreate, db: AsyncSession = Depends(get_db)):
    return await AuthService(db).register(data)

@router.post("/login")
async def login(data: UserLogin, db: AsyncSession = Depends(get_db)):
    return await AuthService(db).login(data)

@router.post("/verify-2fa")
async def verify_2fa(data: TOTPVerify, db: AsyncSession = Depends(get_db)):
    return await AuthService(db).verify_2fa(data)

@router.post("/setup-2fa")
async def setup_2fa(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    return await AuthService(db).setup_totp(current_user)

@router.post("/confirm-2fa")
async def confirm_2fa(
    data: TOTPVerify,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    return await AuthService(db).confirm_totp(current_user, data.code)
