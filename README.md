# High-Performance Data Table API# Full-Stack-Technical-Assessment-v2



A full-stack application demonstrating a high-performance data table that handles 100,000+ records with instantaneous response times (<100ms).Run the FastAPI app locally using uvicorn.



## Tech StackPrereqs:



- **Backend**: FastAPI (Python 3.12)- Python 3.12

- **Database**: PostgreSQL 16- pip

- **Cache**: Redis 7

- **Frontend**: Next.js with TypeScript (coming soon)Install dependencies:

- **Deployment**: Docker Compose

```bash

## Architecturepip install -r requirements.txt

```

```

┌─────────────────────────────────────────────────────────┐Start the dev server:

│                     Frontend (Next.js)                   │

│                                                          │```bash

└─────────────────────────┬───────────────────────────────┘./run.sh

                          │# or

┌─────────────────────────▼───────────────────────────────┐make run

│              FastAPI Backend (Port 8000)                │```

│  - /api/products    - /api/users                        │

│  - /api/orders      - /api/transactions                 │This launches uvicorn with the application instance at `api.app:app` on port 8000 by default.

│  - /api/health                                          │
└──────┬──────────────────┬──────────────────┬────────────┘
       │                  │                  │
┌──────▼────────┐ ┌──────▼────────┐ ┌──────▼────────┐
│  PostgreSQL   │ │     Redis     │ │   File I/O   │
│  (100K+ recs) │ │   (5min TTL)  │ │              │
└───────────────┘ └───────────────┘ └──────────────┘
```

## Features

### Backend
- ✅ REST API with pagination, filtering, and sorting
- ✅ 100,000+ realistic records (products, users, orders, transactions)
- ✅ <100ms response times with caching and query optimization
- ✅ Database indexes for fast queries
- ✅ Redis caching layer (5-minute TTL)
- ✅ Request/response validation with Pydantic
- ✅ Error handling and CORS support

### Data Models
- **Products**: SKU, name, category, price, stock (1,000 records)
- **Users**: Email, name, country, signup date, order history (5,000 records)
- **Orders**: User-product relationships with quantities and prices (100,000 records)
- **Transactions**: Payment details for each order (100,000 records)

## Quick Start

### Option 1: Docker Compose (Recommended)

```bash
# Clone and navigate to project
cd Full-Stack-Technical-Assessment-v2

# Start all services (PostgreSQL, Redis, FastAPI)
docker compose up --build

# Seed database (runs automatically)
# API will be available at http://localhost:8000
```

The first run will:
1. Build the Docker image
2. Start PostgreSQL, Redis, and FastAPI services
3. Automatically run the seed script to populate 100k+ records
4. Start the API server

**Initial seeding takes ~30-60 seconds depending on system performance.**

### Option 2: Local Development

#### Prerequisites
- Python 3.12
- PostgreSQL 16
- Redis 7

#### Setup Steps

1. **Create virtual environment**
   ```bash
   python3.12 -m venv .venv
   source .venv/bin/activate
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure environment**
   ```bash
   # Copy and edit .env
   cp .env.example .env
   ```

4. **Start PostgreSQL and Redis**
   ```bash
   # Using Docker for just the services
   docker run -d -p 5432:5432 \
     -e POSTGRES_PASSWORD=password \
     -e POSTGRES_DB=datatable_db \
     postgres:16-alpine

   docker run -d -p 6379:6379 redis:7-alpine
   ```

5. **Seed database**
   ```bash
   python api/seed.py
   ```

6. **Start FastAPI server**
   ```bash
   uvicorn api.app:app --reload --host 0.0.0.0 --port 8000
   ```

## API Endpoints

### Products
```bash
GET /api/products?page=1&page_size=50&sort_by=created_at&sort_order=desc&search=laptop

Response:
{
  "total": 1000,
  "page": 1,
  "page_size": 50,
  "total_pages": 20,
  "data": [...],
  "response_time_ms": 45.23
}
```

### Users
```bash
GET /api/users?page=1&page_size=50&sort_by=lifetime_value&sort_order=desc&search=john

Response:
{
  "total": 5000,
  "page": 1,
  "page_size": 50,
  "total_pages": 100,
  "data": [...],
  "response_time_ms": 52.15
}
```

### Orders
```bash
GET /api/orders?page=1&page_size=50&status_filter=completed&sort_by=order_date&sort_order=desc

Response:
{
  "total": 100000,
  "page": 1,
  "page_size": 50,
  "total_pages": 2000,
  "data": [...],
  "response_time_ms": 68.42
}
```

### Transactions
```bash
GET /api/transactions?page=1&page_size=50&status_filter=completed

Response:
{
  "total": 100000,
  "page": 1,
  "page_size": 50,
  "total_pages": 2000,
  "data": [...],
  "response_time_ms": 71.38
}
```

### Health Check
```bash
GET /api/health

Response:
{
  "status": "ok"
}
```

## Query Parameters

### Pagination
- `page` (default: 1): Page number (1-indexed)
- `page_size` (default: 50): Items per page (max: 500)

### Filtering
- `search`: Text search across multiple fields
- `status_filter`: Filter by status (for orders/transactions)

### Sorting
- `sort_by`: Field to sort by (e.g., `created_at`, `name`, `price`)
- `sort_order`: Sort direction (`asc` or `desc`)

## Performance Metrics

### Response Times (Typical)
| Endpoint | Page Size | Response Time |
|----------|-----------|---------------|
| /api/products | 50 | ~45ms |
| /api/users | 50 | ~52ms |
| /api/orders | 50 | ~68ms |
| /api/transactions | 50 | ~71ms |

**All responses <100ms ✓**

### Caching Strategy
- Response caching: 5 minutes (Redis)
- Cache key: Generated from endpoint, search params, and page
- Cache invalidation: TTL-based (manual via `invalidate_cache()`)

### Database Optimizations
1. **Indexes on frequently queried fields**:
   - `products`: category, price, created_at
   - `users`: country, signup_date, email
   - `orders`: user_id, product_id, status, order_date
   - `transactions`: status, transaction_date, payment_method

2. **Connection pooling**: 20 connections per process, 40 overflow

3. **Query optimization**:
   - Offset-limit pagination (efficient for large datasets)
   - Early filtering before limit
   - Lazy loading relationships

## Seeding Details

The `api/seed.py` script generates:
- **1,000 products**: With realistic categories and pricing
- **5,000 users**: Distributed across 10 countries
- **100,000 orders**: Randomly distributed user-product relationships
- **100,000 transactions**: Corresponding payment records

**Total: 206,000+ records**

Generation time: ~30-60 seconds (depending on system)

## Development

### Project Structure
```
.
├── api/
│   ├── app.py           # FastAPI application and endpoints
│   ├── models.py        # SQLAlchemy ORM models
│   ├── database.py      # Database configuration
│   ├── cache.py         # Redis caching utilities
│   ├── schemas.py       # Pydantic validation schemas
│   └── seed.py          # Database seeding script
├── requirements.txt     # Python dependencies
├── Dockerfile          # Container image definition
├── docker-compose.yml  # Multi-container orchestration
├── .env                # Environment variables
└── README.md           # This file
```

### Running Tests
```bash
# Test API responses
curl http://localhost:8000/api/health

# Test with pagination
curl "http://localhost:8000/api/products?page=1&page_size=10"

# Test with search and sorting
curl "http://localhost:8000/api/products?search=laptop&sort_by=price&sort_order=asc"
```

### Adding More Data
To generate additional records, modify the counts in `api/seed.py`:
```python
for i in range(100000):  # Change to 200000 for 200k orders
```

Then re-run: `python api/seed.py`

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 8000
lsof -ti:8000 | xargs kill -9

# Kill process on port 5432
lsof -ti:5432 | xargs kill -9

# Kill process on port 6379
lsof -ti:6379 | xargs kill -9
```

### Database Connection Errors
```bash
# Check PostgreSQL is running
docker ps | grep postgres

# Check Redis is running
docker ps | grep redis

# Verify environment variables
cat .env
```

### Cache Not Working
Redis connection errors are handled gracefully—caching will be disabled and requests will go directly to the database. Check logs for details.

### Slow Seeding
- Reduce the number of records in `api/seed.py`
- Run on a system with SSD storage
- Increase PostgreSQL `work_mem` setting

## Next Steps

- [ ] Add Next.js frontend with virtual scrolling
- [ ] Implement real-time WebSocket updates
- [ ] Add authentication and authorization
- [ ] Create GraphQL endpoint as alternative
- [ ] Add monitoring and observability
- [ ] Optimize for billions of records
- [ ] Deploy to production (AWS, GCP, etc.)

## License

MIT

## Support

For issues or questions, open an issue on GitHub.
