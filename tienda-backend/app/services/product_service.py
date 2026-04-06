from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_
from sqlalchemy.orm import selectinload
from fastapi import HTTPException
from app.models.product import Product, Category
from app.schemas.product import ProductCreate, ProductUpdate, CategoryCreate

class ProductService:
    def __init__(self, db: AsyncSession):
        self.db = db

    # --- Categorías ---
    async def create_category(self, data: CategoryCreate) -> Category:
        category = Category(name=data.name, description=data.description)
        self.db.add(category)
        await self.db.commit()
        await self.db.refresh(category)
        return category

    async def get_categories(self) -> list[Category]:
        result = await self.db.execute(select(Category))
        return result.scalars().all()

    # --- Productos ---
    async def create_product(self, data: ProductCreate) -> Product:
        category = await self.db.get(Category, data.category_id)
        if not category:
            raise HTTPException(status_code=404, detail="Categoría no encontrada")

        product = Product(**data.model_dump())
        self.db.add(product)
        await self.db.commit()

        # Recarga el producto CON la categoría incluida
        result = await self.db.execute(
            select(Product)
            .options(selectinload(Product.category))
            .where(Product.id == product.id)
        )
        return result.scalar_one()

    async def get_products(
        self,
        search: str | None = None,
        category_id: int | None = None,
        min_price: float | None = None,
        max_price: float | None = None,
    ) -> list[Product]:
        query = (
            select(Product)
            .options(selectinload(Product.category))  # carga la categoría junto
            .where(Product.is_active == True)
        )

        if search:
            query = query.where(
                or_(
                    Product.name.ilike(f"%{search}%"),
                    Product.description.ilike(f"%{search}%")
                )
            )
        if category_id:
            query = query.where(Product.category_id == category_id)
        if min_price is not None:
            query = query.where(Product.price >= min_price)
        if max_price is not None:
            query = query.where(Product.price <= max_price)

        result = await self.db.execute(query)
        return result.scalars().all()

    async def get_product(self, product_id: int) -> Product:
        result = await self.db.execute(
            select(Product)
            .options(selectinload(Product.category))
            .where(Product.id == product_id)
        )
        product = result.scalar_one_or_none()
        if not product:
            raise HTTPException(status_code=404, detail="Producto no encontrado")
        return product

    async def update_product(self, product_id: int, data: ProductUpdate) -> Product:
        product = await self.get_product(product_id)
        for field, value in data.model_dump(exclude_none=True).items():
            setattr(product, field, value)
        await self.db.commit()
        return await self.get_product(product_id)

    async def delete_product(self, product_id: int) -> dict:
        product = await self.get_product(product_id)
        product.is_active = False
        await self.db.commit()
        return {"mensaje": "Producto desactivado"}