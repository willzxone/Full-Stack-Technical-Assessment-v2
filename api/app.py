# Import required FastAPI components for building the API
from fastapi import FastAPI, HTTPException, Depends, Query
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import desc, asc, or_, and_
import time

from api.database import init_db, get_db
from api.models import Product, User, Order, Transaction
from api.schemas import (
    ProductResponse, UserResponse, OrderResponse, TransactionResponse,
    PaginatedResponse, FilterParams
)
from api.cache import get_cached, set_cache, cache_key

# Initialize FastAPI application with a title
app = FastAPI(title="High-Performance Data Table API")

# Configure CORS (Cross-Origin Resource Sharing) middleware
# This allows the API to be accessed from different domains/origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows requests from any origin
    allow_credentials=True,  # Allows cookies to be included in requests
    allow_methods=["*"],  # Allows all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers in requests
)

# Initialize database on startup
@app.on_event("startup")
async def startup():
    init_db()


# Define a health check endpoint to verify API status
@app.get("/api/health")
async def health_check():
    return {"status": "ok"}


# ===== Products Endpoints =====
@app.get("/api/products")
async def get_products(
    db: Session = Depends(get_db),
    search: str = Query(None, description="Search by name or category"),
    sort_by: str = Query("created_at", description="Sort field"),
    sort_order: str = Query("desc", regex="^(asc|desc)$"),
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=500),
):
    """Get paginated products with filtering and sorting."""
    start_time = time.time()
    
    # Try to get from cache
    cache_key_str = cache_key("products", search=search, sort_by=sort_by, 
                              sort_order=sort_order, page=page, page_size=page_size)
    cached_result = get_cached(cache_key_str)
    if cached_result:
        return cached_result
    
    try:
        query = db.query(Product)
        
        # Apply search filter
        if search:
            query = query.filter(
                or_(
                    Product.name.ilike(f"%{search}%"),
                    Product.category.ilike(f"%{search}%"),
                    Product.sku.ilike(f"%{search}%"),
                )
            )
        
        # Get total count
        total = query.count()
        
        # Apply sorting
        sort_field = getattr(Product, sort_by, Product.created_at)
        if sort_order == "desc":
            query = query.order_by(desc(sort_field))
        else:
            query = query.order_by(asc(sort_field))
        
        # Apply pagination
        offset = (page - 1) * page_size
        items = query.offset(offset).limit(page_size).all()
        
        total_pages = (total + page_size - 1) // page_size
        
        response = {
            "total": total,
            "page": page,
            "page_size": page_size,
            "total_pages": total_pages,
            "data": [
                {
                    "id": item.id,
                    "sku": item.sku,
                    "name": item.name,
                    "category": item.category,
                    "price": item.price,
                    "stock": item.stock,
                    "created_at": item.created_at.isoformat(),
                }
                for item in items
            ],
            "response_time_ms": round((time.time() - start_time) * 1000, 2),
        }
        
        # Cache the result for 5 minutes
        set_cache(cache_key_str, response, ttl=300)
        
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ===== Users Endpoints =====
@app.get("/api/users")
async def get_users(
    db: Session = Depends(get_db),
    search: str = Query(None, description="Search by name or email"),
    sort_by: str = Query("signup_date", description="Sort field"),
    sort_order: str = Query("desc", regex="^(asc|desc)$"),
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=500),
):
    """Get paginated users with filtering and sorting."""
    start_time = time.time()
    
    # Try to get from cache
    cache_key_str = cache_key("users", search=search, sort_by=sort_by,
                              sort_order=sort_order, page=page, page_size=page_size)
    cached_result = get_cached(cache_key_str)
    if cached_result:
        return cached_result
    
    try:
        query = db.query(User)
        
        # Apply search filter
        if search:
            query = query.filter(
                or_(
                    User.name.ilike(f"%{search}%"),
                    User.email.ilike(f"%{search}%"),
                    User.country.ilike(f"%{search}%"),
                )
            )
        
        # Get total count
        total = query.count()
        
        # Apply sorting
        sort_field = getattr(User, sort_by, User.signup_date)
        if sort_order == "desc":
            query = query.order_by(desc(sort_field))
        else:
            query = query.order_by(asc(sort_field))
        
        # Apply pagination
        offset = (page - 1) * page_size
        items = query.offset(offset).limit(page_size).all()
        
        total_pages = (total + page_size - 1) // page_size
        
        response = {
            "total": total,
            "page": page,
            "page_size": page_size,
            "total_pages": total_pages,
            "data": [
                {
                    "id": item.id,
                    "email": item.email,
                    "name": item.name,
                    "country": item.country,
                    "signup_date": item.signup_date.isoformat(),
                    "total_orders": item.total_orders,
                    "lifetime_value": item.lifetime_value,
                }
                for item in items
            ],
            "response_time_ms": round((time.time() - start_time) * 1000, 2),
        }
        
        # Cache the result for 5 minutes
        set_cache(cache_key_str, response, ttl=300)
        
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ===== Orders Endpoints =====
@app.get("/api/orders")
async def get_orders(
    db: Session = Depends(get_db),
    status_filter: str = Query(None, description="Filter by status"),
    sort_by: str = Query("order_date", description="Sort field"),
    sort_order: str = Query("desc", regex="^(asc|desc)$"),
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=500),
):
    """Get paginated orders with filtering and sorting."""
    start_time = time.time()
    
    # Try to get from cache
    cache_key_str = cache_key("orders", status_filter=status_filter, sort_by=sort_by,
                              sort_order=sort_order, page=page, page_size=page_size)
    cached_result = get_cached(cache_key_str)
    if cached_result:
        return cached_result
    
    try:
        query = db.query(Order)
        
        # Apply status filter
        if status_filter:
            query = query.filter(Order.status == status_filter)
        
        # Get total count
        total = query.count()
        
        # Apply sorting
        sort_field = getattr(Order, sort_by, Order.order_date)
        if sort_order == "desc":
            query = query.order_by(desc(sort_field))
        else:
            query = query.order_by(asc(sort_field))
        
        # Apply pagination
        offset = (page - 1) * page_size
        items = query.offset(offset).limit(page_size).all()
        
        total_pages = (total + page_size - 1) // page_size
        
        response = {
            "total": total,
            "page": page,
            "page_size": page_size,
            "total_pages": total_pages,
            "data": [
                {
                    "id": item.id,
                    "user_id": item.user_id,
                    "product_id": item.product_id,
                    "quantity": item.quantity,
                    "total_price": item.total_price,
                    "status": item.status,
                    "order_date": item.order_date.isoformat(),
                }
                for item in items
            ],
            "response_time_ms": round((time.time() - start_time) * 1000, 2),
        }
        
        # Cache the result for 5 minutes
        set_cache(cache_key_str, response, ttl=300)
        
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ===== Transactions Endpoints =====
@app.get("/api/transactions")
async def get_transactions(
    db: Session = Depends(get_db),
    status_filter: str = Query(None, description="Filter by status"),
    sort_by: str = Query("transaction_date", description="Sort field"),
    sort_order: str = Query("desc", regex="^(asc|desc)$"),
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=500),
):
    """Get paginated transactions with filtering and sorting."""
    start_time = time.time()
    
    # Try to get from cache
    cache_key_str = cache_key("transactions", status_filter=status_filter, sort_by=sort_by,
                              sort_order=sort_order, page=page, page_size=page_size)
    cached_result = get_cached(cache_key_str)
    if cached_result:
        return cached_result
    
    try:
        query = db.query(Transaction)
        
        # Apply status filter
        if status_filter:
            query = query.filter(Transaction.status == status_filter)
        
        # Get total count
        total = query.count()
        
        # Apply sorting
        sort_field = getattr(Transaction, sort_by, Transaction.transaction_date)
        if sort_order == "desc":
            query = query.order_by(desc(sort_field))
        else:
            query = query.order_by(asc(sort_field))
        
        # Apply pagination
        offset = (page - 1) * page_size
        items = query.offset(offset).limit(page_size).all()
        
        total_pages = (total + page_size - 1) // page_size
        
        response = {
            "total": total,
            "page": page,
            "page_size": page_size,
            "total_pages": total_pages,
            "data": [
                {
                    "id": item.id,
                    "order_id": item.order_id,
                    "amount": item.amount,
                    "currency": item.currency,
                    "payment_method": item.payment_method,
                    "status": item.status,
                    "transaction_date": item.transaction_date.isoformat(),
                }
                for item in items
            ],
            "response_time_ms": round((time.time() - start_time) * 1000, 2),
        }
        
        # Cache the result for 5 minutes
        set_cache(cache_key_str, response, ttl=300)
        
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Entry point for running the application directly
if __name__ == "__main__":
    import uvicorn
    # Start the server on all network interfaces (0.0.0.0) on port 8000
    uvicorn.run(app, host="0.0.0.0", port=8000)
