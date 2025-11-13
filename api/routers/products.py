"""Products router - handles all product-related endpoints."""
from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import desc, asc, or_
import time

from api.database import get_db
from api.models import Product
from api.cache import get_cached, set_cache, cache_key

router = APIRouter(prefix="/api/products", tags=["products"])


@router.get("")
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
