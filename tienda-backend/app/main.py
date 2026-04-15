from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import engine, Base
from app.models import user, product, order, ticket
from app.routers import auth, products, cart, tickets

app = FastAPI(title=settings.APP_NAME)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://tienda-frontend-bacs.onrender.com",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def crear_tablas():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("✓ Tablas creadas en la base de datos")

app.include_router(auth.router)
app.include_router(products.router)
app.include_router(cart.router)
app.include_router(tickets.router)

@app.get("/")
async def root():
    return {"mensaje": "¡El backend funciona!"}
