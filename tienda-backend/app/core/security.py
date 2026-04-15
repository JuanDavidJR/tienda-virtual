from datetime import datetime, timedelta
from jose import jwt, JWTError
from passlib.context import CryptContext
import pyotp
from app.core.config import settings

# Configuración del encriptado de contraseñas
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    """Convierte una contraseña en texto a su versión encriptada."""
    return pwd_context.hash(password)

def verify_password(plain: str, hashed: str) -> bool:
    """Compara contraseña ingresada con la encriptada en DB."""
    return pwd_context.verify(plain, hashed)

def create_access_token(user_id: int, is_admin: bool = False) -> str:
    payload = {
        "sub": str(user_id),
        "type": "access",
        "is_admin": is_admin,
        "exp": datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    }
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

def decode_token(token: str) -> dict | None:
    """Lee el token JWT y devuelve su contenido. Si es inválido, devuelve None."""
    try:
        return jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
    except JWTError:
        return None

# --- 2FA (Google Authenticator) ---
def generate_totp_secret() -> str:
    """Genera una clave secreta para el 2FA del usuario."""
    return pyotp.random_base32()

def get_totp_uri(secret: str, email: str) -> str:
    """Genera el enlace QR que el usuario escanea con Google Authenticator."""
    totp = pyotp.TOTP(secret)
    return totp.provisioning_uri(name=email, issuer_name=settings.OTP_ISSUER)

def verify_totp(secret: str, code: str) -> bool:
    """Verifica que el código de 6 dígitos del usuario sea correcto."""
    totp = pyotp.TOTP(secret)
    return totp.verify(code, valid_window=1)
