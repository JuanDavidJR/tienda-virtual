from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.schemas.user import UserCreate, UserLogin, TOTPVerify
from app.services.auth_service import AuthService

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