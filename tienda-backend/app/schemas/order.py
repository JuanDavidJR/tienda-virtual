from pydantic import BaseModel
from app.models.order import OrderStatus

class CartItemAdd(BaseModel):
    product_id: int
    quantity: int = 1

class CartItemResponse(BaseModel):
    id: int
    product_id: int
    quantity: int
    product_name: str
    unit_price: float
    subtotal: float

    class Config:
        from_attributes = True

class CartResponse(BaseModel):
    items: list[CartItemResponse]
    total: float

class OrderCreate(BaseModel):
    shipping_address: str

class OrderItemResponse(BaseModel):
    product_id: int
    quantity: int
    unit_price: float
    subtotal: float

    class Config:
        from_attributes = True

class OrderResponse(BaseModel):
    id: int
    status: OrderStatus
    total: float
    shipping_address: str
    items: list[OrderItemResponse]

    class Config:
        from_attributes = True