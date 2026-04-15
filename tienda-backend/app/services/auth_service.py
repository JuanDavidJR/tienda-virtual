from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException, status
from app.models.user import User
from app.schemas.user import UserCreate, UserLogin, TOTPVerify
from app.core.security import (
    hash_password, verify_password,
    create_access_token,
    generate_totp_secret, get_totp_uri, verify_totp
)

class AuthService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def _get_user_by_email(self, email: str) -> User | None:
        result = await self.db.execute(select(User).where(User.email == email))
        return result.scalar_one_or_none()

    async def register(self, data: UserCreate) -> dict:
        # Verificar si el email ya existe
        if await self._get_user_by_email(data.email):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Este email ya está registrado"
            )

        user = User(
            email=data.email,
            full_name=data.full_name,
            hashed_password=hash_password(data.password)
        )
        self.db.add(user)
        await self.db.commit()
        await self.db.refresh(user)

        return {"mensaje": "Usuario registrado exitosamente", "id": user.id}

    async def login(self, data: UserLogin) -> dict:
        user = await self._get_user_by_email(data.email)

        # Mismo mensaje para email o contraseña incorrectos (seguridad)
        if not user or not verify_password(data.password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Email o contraseña incorrectos"
            )

        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Cuenta desactivada"
            )

        # Si tiene 2FA activo, no damos el token todavía
        if user.totp_enabled:
            return {"requiere_2fa": True, "email": user.email}

        token = create_access_token(user.id, user.is_admin)
        return {"access_token": token, "token_type": "bearer"}

    async def setup_totp(self, user: User) -> dict:
        """Genera el QR para que el usuario configure Google Authenticator."""
        secret = generate_totp_secret()
        uri = get_totp_uri(secret, user.email)

        # Guardamos el secret pero no activamos 2FA hasta que el usuario confirme
        user.totp_secret = secret
        await self.db.commit()

        return {"qr_uri": uri, "secret": secret}

    async def confirm_totp(self, user: User, code: str) -> dict:
        """El usuario escanea el QR y envía el primer código para confirmar."""
        if not user.totp_secret:
            raise HTTPException(status_code=400, detail="Primero configura el 2FA")

        if not verify_totp(user.totp_secret, code):
            raise HTTPException(status_code=400, detail="Código incorrecto")

        user.totp_enabled = True
        await self.db.commit()
        return {"mensaje": "2FA activado correctamente"}

    async def verify_2fa(self, data: TOTPVerify) -> dict:
        """Segundo paso del login cuando el usuario tiene 2FA activo."""
        user = await self._get_user_by_email(data.email)

        if not user or not user.totp_enabled:
            raise HTTPException(status_code=400, detail="2FA no configurado")

        if not verify_totp(user.totp_secret, data.code):
            raise HTTPException(status_code=401, detail="Código incorrecto")

        token = create_access_token(user.id, user.is_admin)
        return {"access_token": token, "token_type": "bearer"}
