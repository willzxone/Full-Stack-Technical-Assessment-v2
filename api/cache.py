import os
import json
import redis
from typing import Any, Optional

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")

try:
    redis_client = redis.from_url(REDIS_URL, decode_responses=True)
    redis_client.ping()
    REDIS_AVAILABLE = True
except Exception as e:
    print(f"Warning: Redis not available ({e}). Cache will be disabled.")
    redis_client = None
    REDIS_AVAILABLE = False


def cache_key(prefix: str, **kwargs) -> str:
    """Generate a cache key from prefix and kwargs."""
    key_parts = [prefix]
    for k, v in sorted(kwargs.items()):
        key_parts.append(f"{k}:{v}")
    return ":".join(key_parts)


def get_cached(key: str) -> Optional[Any]:
    """Retrieve value from cache."""
    if not REDIS_AVAILABLE:
        return None
    try:
        value = redis_client.get(key)
        return json.loads(value) if value else None
    except Exception as e:
        print(f"Cache get error: {e}")
        return None


def set_cache(key: str, value: Any, ttl: int = 300) -> bool:
    """Set value in cache with TTL (default 5 minutes)."""
    if not REDIS_AVAILABLE:
        return False
    try:
        redis_client.setex(key, ttl, json.dumps(value))
        return True
    except Exception as e:
        print(f"Cache set error: {e}")
        return False


def invalidate_cache(pattern: str = "*") -> None:
    """Invalidate cache keys matching pattern."""
    if not REDIS_AVAILABLE:
        return
    try:
        for key in redis_client.scan_iter(match=pattern):
            redis_client.delete(key)
    except Exception as e:
        print(f"Cache invalidation error: {e}")
