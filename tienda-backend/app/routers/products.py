from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.schemas.product import ProductCreate, ProductUpdate, ProductResponse, CategoryCreate, CategoryResponse
from app.services.product_service import ProductService

router = APIRouter(prefix="/products", tags=["Productos"])

# --- Categorías ---
@router.post("/categories", response_model=CategoryResponse, status_code=201)
async def create_category(data: CategoryCreate, db: AsyncSession = Depends(get_db)):
    return await ProductService(db).create_category(data)

@router.get("/categories", response_model=list[CategoryResponse])
async def get_categories(db: AsyncSession = Depends(get_db)):
    return await ProductService(db).get_categories()

# --- Productos ---
@router.post("/", response_model=ProductResponse, status_code=201)
async def create_product(data: ProductCreate, db: AsyncSession = Depends(get_db)):
    return await ProductService(db).create_product(data)

@router.get("/", response_model=list[ProductResponse])
async def get_products(
    search: str | None = Query(default=None, description="Buscar por nombre o descripción"),
    category_id: int | None = Query(default=None, description="Filtrar por categoría"),
    min_price: float | None = Query(default=None, description="Precio mínimo"),
    max_price: float | None = Query(default=None, description="Precio máximo"),
    db: AsyncSession = Depends(get_db)
):
    return await ProductService(db).get_products(search, category_id, min_price, max_price)

@router.get("/{product_id}", response_model=ProductResponse)
async def get_product(product_id: int, db: AsyncSession = Depends(get_db)):
    return await ProductService(db).get_product(product_id)

@router.patch("/{product_id}", response_model=ProductResponse)
async def update_product(product_id: int, data: ProductUpdate, db: AsyncSession = Depends(get_db)):
    return await ProductService(db).update_product(product_id, data)

@router.delete("/{product_id}")
async def delete_product(product_id: int, db: AsyncSession = Depends(get_db)):
    return await ProductService(db).delete_product(product_id)
