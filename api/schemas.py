from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class ProductResponse(BaseModel):
    id: str
    sku: str
    name: str
    description: Optional[str]
    category: str
    price: float
    stock: int
    created_at: datetime

    class Config:
        from_attributes = True


class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    country: str
    signup_date: datetime
    total_orders: int
    lifetime_value: float

    class Config:
        from_attributes = True


class OrderResponse(BaseModel):
    id: str
    user_id: str
    product_id: str
    quantity: int
    total_price: float
    status: str
    order_date: datetime

    class Config:
        from_attributes = True


class TransactionResponse(BaseModel):
    id: str
    order_id: str
    amount: float
    currency: str
    payment_method: str
    status: str
    transaction_date: datetime

    class Config:
        from_attributes = True


class PaginatedResponse(BaseModel):
    total: int
    page: int
    page_size: int
    total_pages: int
    data: list
    
    class Config:
        from_attributes = True


class FilterParams(BaseModel):
    search: Optional[str] = None
    sort_by: Optional[str] = None
    sort_order: Optional[str] = Field("asc", pattern="^(asc|desc)$")
    page: int = Field(1, ge=1)
    page_size: int = Field(50, ge=1, le=500)

    class Config:
        from_attributes = True
