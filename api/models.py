import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, DateTime, ForeignKey, Index
from sqlalchemy.orm import relationship
from api.database import Base


class Product(Base):
    __tablename__ = "products"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    sku = Column(String(50), unique=True, nullable=False, index=True)
    name = Column(String(255), nullable=False, index=True)
    description = Column(String(1024))
    category = Column(String(100), nullable=False, index=True)
    price = Column(Float, nullable=False)
    stock = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    orders = relationship("Order", back_populates="product")

    __table_args__ = (
        Index("idx_product_category_price", "category", "price"),
        Index("idx_product_created_at", "created_at"),
    )


class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String(255), unique=True, nullable=False, index=True)
    name = Column(String(255), nullable=False)
    country = Column(String(100), nullable=False, index=True)
    signup_date = Column(DateTime, default=datetime.utcnow, index=True)
    total_orders = Column(Integer, default=0)
    lifetime_value = Column(Float, default=0.0)

    orders = relationship("Order", back_populates="user")

    __table_args__ = (
        Index("idx_user_country", "country"),
        Index("idx_user_signup_date", "signup_date"),
    )


class Order(Base):
    __tablename__ = "orders"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False, index=True)
    product_id = Column(String(36), ForeignKey("products.id"), nullable=False, index=True)
    quantity = Column(Integer, nullable=False)
    total_price = Column(Float, nullable=False)
    status = Column(String(50), default="pending", index=True)
    order_date = Column(DateTime, default=datetime.utcnow, index=True)

    user = relationship("User", back_populates="orders")
    product = relationship("Product", back_populates="orders")

    __table_args__ = (
        Index("idx_order_user_date", "user_id", "order_date"),
        Index("idx_order_status", "status"),
    )


class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    order_id = Column(String(36), ForeignKey("orders.id"), nullable=False, index=True)
    amount = Column(Float, nullable=False)
    currency = Column(String(10), default="USD")
    payment_method = Column(String(50), nullable=False, index=True)
    status = Column(String(50), default="pending", index=True)
    transaction_date = Column(DateTime, default=datetime.utcnow, index=True)

    __table_args__ = (
        Index("idx_transaction_date", "transaction_date"),
        Index("idx_transaction_status", "status"),
    )
