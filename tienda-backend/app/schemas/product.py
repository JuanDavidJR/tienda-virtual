from pydantic import BaseModel

class CategoryCreate(BaseModel):
    name: str
    description: str | None = None

class CategoryResponse(BaseModel):
    id: int
    name: str
    description: str | None

    class Config:
        from_attributes = True

class ProductCreate(BaseModel):
    name: str
    description: str
    price: float
    stock: int
    image_url: str | None = None
    category_id: int

class ProductUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    price: float | None = None
    stock: int | None = None
    image_url: str | None = None
    is_active: bool | None = None

class ProductResponse(BaseModel):
    id: int
    name: str
    description: str
    price: float
    stock: int
    image_url: str | None
    is_active: bool
    category: CategoryResponse

    class Config:
        from_attributes = True