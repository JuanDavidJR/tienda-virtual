from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from fastapi import HTTPException
from app.models.order import CartItem, Order, OrderItem, OrderStatus
from app.models.product import Product
from app.schemas.order import CartItemAdd, OrderCreate

class OrderService:
    def __init__(self, db: AsyncSession, user_id: int):
        self.db = db
        self.user_id = user_id

    # --- Carrito ---
    async def get_cart(self) -> dict:
        result = await self.db.execute(
            select(CartItem)
            .options(selectinload(CartItem.product))
            .where(CartItem.user_id == self.user_id)
        )
        items = result.scalars().all()

        cart_items = []
        total = 0.0
        for item in items:
            subtotal = float(item.product.price) * item.quantity
            total += subtotal
            cart_items.append({
                "id": item.id,
                "product_id": item.product_id,
                "quantity": item.quantity,
                "product_name": item.product.name,
                "unit_price": float(item.product.price),
                "subtotal": subtotal
            })

        return {"items": cart_items, "total": total}

    async def add_to_cart(self, data: CartItemAdd) -> dict:
        # Verificar que el producto existe y tiene stock
        product = await self.db.get(Product, data.product_id)
        if not product or not product.is_active:
            raise HTTPException(status_code=404, detail="Producto no encontrado")
        if product.stock < data.quantity:
            raise HTTPException(status_code=400, detail=f"Stock insuficiente. Disponible: {product.stock}")

        # Si ya está en el carrito, suma la cantidad
        result = await self.db.execute(
            select(CartItem).where(
                CartItem.user_id == self.user_id,
                CartItem.product_id == data.product_id
            )
        )
        existing = result.scalar_one_or_none()

        if existing:
            existing.quantity += data.quantity
        else:
            cart_item = CartItem(
                user_id=self.user_id,
                product_id=data.product_id,
                quantity=data.quantity
            )
            self.db.add(cart_item)

        await self.db.commit()
        return {"mensaje": "Producto agregado al carrito"}

    async def remove_from_cart(self, item_id: int) -> dict:
        result = await self.db.execute(
            select(CartItem).where(
                CartItem.id == item_id,
                CartItem.user_id == self.user_id
            )
        )
        item = result.scalar_one_or_none()
        if not item:
            raise HTTPException(status_code=404, detail="Item no encontrado")

        await self.db.delete(item)
        await self.db.commit()
        return {"mensaje": "Producto eliminado del carrito"}

    async def clear_cart(self) -> None:
        result = await self.db.execute(
            select(CartItem).where(CartItem.user_id == self.user_id)
        )
        for item in result.scalars().all():
            await self.db.delete(item)
        await self.db.commit()

    # --- Pedidos ---
    async def create_order(self, data: OrderCreate) -> Order:
        cart = await self.get_cart()
        if not cart["items"]:
            raise HTTPException(status_code=400, detail="El carrito está vacío")

        order = Order(
            user_id=self.user_id,
            total=cart["total"],
            shipping_address=data.shipping_address
        )
        self.db.add(order)
        await self.db.flush()  # obtiene el ID sin hacer commit aún

        for item in cart["items"]:
            order_item = OrderItem(
                order_id=order.id,
                product_id=item["product_id"],
                quantity=item["quantity"],
                unit_price=item["unit_price"]
            )
            self.db.add(order_item)

            # Descuenta el stock
            product = await self.db.get(Product, item["product_id"])
            product.stock -= item["quantity"]

        await self.db.commit()
        await self.clear_cart()

        # Recarga con items
        result = await self.db.execute(
            select(Order)
            .options(selectinload(Order.items))
            .where(Order.id == order.id)
        )
        return result.scalar_one()

    async def get_orders(self) -> list[Order]:
        result = await self.db.execute(
            select(Order)
            .options(selectinload(Order.items))
            .where(Order.user_id == self.user_id)
        )
        return result.scalars().all()