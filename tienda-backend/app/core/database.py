from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import DeclarativeBase
from app.core.config import settings

# Motor de base de datos (async)
engine = create_async_engine(
    settings.DATABASE_URL,
    echo=settings.DEBUG,       # muestra las queries SQL en la terminal
    connect_args={"check_same_thread": False}  # solo necesario para SQLite
)

AsyncSessionLocal = async_sessionmaker(engine, expire_on_commit=False)

# Clase base de la que heredan todos los modelos
class Base(DeclarativeBase):
    pass

# Esta función la usas en cada ruta para obtener la sesión de DB
async def get_db() -> AsyncSession:
    async with AsyncSessionLocal() as session:
        yield session