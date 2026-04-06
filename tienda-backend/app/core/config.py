from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = "TiendaVirtual API"
    DEBUG: bool = False
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    DATABASE_URL: str
    REDIS_URL: str = "redis://localhost:6379"
    OTP_ISSUER: str = "TiendaVirtual"

    class Config:
        env_file = ".env"

settings = Settings()