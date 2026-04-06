from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.middleware.auth_middleware import get_current_user
from app.models.user import User
from app.schemas.order import CartItemAdd, OrderCreate
from app.services.order_service import OrderService

router = APIRouter(prefix="/cart", tags=["Carrito y Pedidos"])

@router.get("/")
async def get_cart(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    return await OrderService(db, current_user.id).get_cart()

@router.post("/add")
async def add_to_cart(
    data: CartItemAdd,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    return await OrderService(db, current_user.id).add_to_cart(data)

@router.delete("/item/{item_id}")
async def remove_from_cart(
    item_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    return await OrderService(db, current_user.id).remove_from_cart(item_id)

@router.post("/checkout")
async def create_order(
    data: OrderCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    return await OrderService(db, current_user.id).create_order(data)

@router.get("/orders")
async def get_orders(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    return await OrderService(db, current_user.id).get_orders()