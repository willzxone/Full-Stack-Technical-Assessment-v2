"""Orders router - handles all order-related endpoints."""
from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import desc, asc, or_
import time

from api.database import get_db
from api.models import Order
from api.cache import get_cached, set_cache, cache_key

router = APIRouter(prefix="/api/orders", tags=["orders"])


@router.get("")
async def get_orders(
    db: Session = Depends(get_db),
    status: str = Query(None, description="Filter by order status"),
    sort_by: str = Query("order_date", description="Sort field"),
    sort_order: str = Query("desc", regex="^(asc|desc)$"),
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=500),
):
    """Get paginated orders with filtering and sorting."""
    start_time = time.time()
    
    # Try to get from cache
    cache_key_str = cache_key("orders", status=status, sort_by=sort_by, 
                              sort_order=sort_order, page=page, page_size=page_size)
    cached_result = get_cached(cache_key_str)
    if cached_result:
        return cached_result
    
    try:
        query = db.query(Order)
        
        # Apply status filter
        if status:
            query = query.filter(Order.status == status)
        
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
