"""Transactions router - handles all transaction-related endpoints."""
from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import desc, asc
import time

from api.database import get_db
from api.models import Transaction
from api.cache import get_cached, set_cache, cache_key

router = APIRouter(prefix="/api/transactions", tags=["transactions"])


@router.get("")
async def get_transactions(
    db: Session = Depends(get_db),
    payment_method: str = Query(None, description="Filter by payment method"),
    status: str = Query(None, description="Filter by transaction status"),
    sort_by: str = Query("transaction_date", description="Sort field"),
    sort_order: str = Query("desc", regex="^(asc|desc)$"),
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=500),
):
    """Get paginated transactions with filtering and sorting."""
    start_time = time.time()
    
    # Try to get from cache
    cache_key_str = cache_key("transactions", payment_method=payment_method, 
                              status=status, sort_by=sort_by, 
                              sort_order=sort_order, page=page, page_size=page_size)
    cached_result = get_cached(cache_key_str)
    if cached_result:
        return cached_result
    
    try:
        query = db.query(Transaction)
        
        # Apply payment method filter
        if payment_method:
            query = query.filter(Transaction.payment_method == payment_method)
        
        # Apply status filter
        if status:
            query = query.filter(Transaction.status == status)
        
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
