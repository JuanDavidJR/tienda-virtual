from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    """Datos que el usuario envía al registrarse."""
    email: EmailStr
    full_name: str
    password: str

class UserLogin(BaseModel):
    """Datos para iniciar sesión."""
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    """Lo que la API devuelve sobre un usuario (nunca la contraseña)."""
    id: int
    email: str
    full_name: str
    is_admin: bool
    totp_enabled: bool

    class Config:
        from_attributes = True

class Token(BaseModel):
    """Respuesta cuando el login es exitoso."""
    access_token: str
    token_type: str = "bearer"

class TOTPVerify(BaseModel):
    """Para verificar el código de 6 dígitos del 2FA."""
    email: EmailStr
    code: str