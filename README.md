# Full-Stack Technical Assessment v2

A production-grade full-stack application demonstrating high-performance data tables handling 100,000+ records with **<100ms response times**, built with **Next.js 16**, **FastAPI**, **PostgreSQL**, and **Redis**.

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Setup Instructions](#setup-instructions)
- [Performance Optimization](#performance-optimization)
- [API Endpoints](#api-endpoints)
- [Frontend Features](#frontend-features)
- [UI/UX Considerations](#uiux-considerations)
- [Database Schema](#database-schema)
- [Future Improvements](#future-improvements)

## 🚀 Quick Start

### Docker Compose (Recommended)

```bash
# Clone and navigate
cd Full-Stack-Technical-Assessment-v2

# Start all services
docker compose up --build

# API: http://localhost:8000
# Frontend: http://localhost:3000
```

**First run will automatically seed 206,000+ records (~30-60 seconds)**

### Local Development

```bash
# Backend
python3.12 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn api.app:app --reload

# Frontend (in another terminal)
cd frontend
npm install
npm run dev
```

## 🛠 Tech Stack

| Component      | Technology                         | Purpose                         |
| -------------- | ---------------------------------- | ------------------------------- |
| **Backend**    | FastAPI + Python 3.12              | REST API, pagination, filtering |
| **Database**   | PostgreSQL 16                      | 100K+ records with indexes      |
| **Cache**      | Redis 7                            | 5-min TTL, <100ms responses     |
| **Frontend**   | Next.js 16 + React 19 + TypeScript | Modern UI with data tables      |
| **Styling**    | TailwindCSS 4                      | Light theme, responsive design  |
| **Deployment** | Docker Compose                     | Containerized orchestration     |

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────┐
│              Frontend (Next.js 16 + React 19)           │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐   │
│  │  Home Page   │ │ Data Tables  │ │Mobile Menu   │   │
│  │ (Responsive) │ │ (Glassmorphic│ │(Hamburger)   │   │
│  └──────────────┘ └──────────────┘ └──────────────┘   │
└─────────────────────────┬──────────────────────────────┘
                          │ HTTP/REST
┌─────────────────────────▼──────────────────────────────┐
│           FastAPI Backend (Port 8000)                   │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │ Products │ │  Users   │ │ Orders   │ │Txns      │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │
│                                                         │
│  • Pagination (offset/limit)                           │
│  • Advanced sorting & filtering                        │
│  • Request validation (Pydantic)                       │
│  • CORS & error handling                              │
└──────────┬────────────────┬─────────────┬──────────────┘
           │                │             │
    ┌──────▼────────┐ ┌────▼─────────┐ ┌──▼──────────┐
    │  PostgreSQL   │ │   Redis      │ │  File I/O   │
    │  (16 with     │ │  (Cache      │ │  (Seeding)  │
    │  indexes)     │ │  5-min TTL)  │ │             │
    └───────────────┘ └──────────────┘ └─────────────┘

Data Flow:
1. Frontend makes API request → Backend
2. Backend checks Redis cache → Hit (return) / Miss (query DB)
3. Query PostgreSQL with indexes
4. Cache result for 5 minutes
5. Return response <100ms
```

## 📦 Setup Instructions

### Prerequisites

- **Docker & Docker Compose** (Recommended)
- OR **Python 3.12**, **PostgreSQL 16**, **Redis 7**, **Node.js 18+**

### Option 1: Docker Compose (Easiest)

```bash
# 1. Clone repository
git clone <repo-url>
cd Full-Stack-Technical-Assessment-v2

# 2. Start all services
docker compose up --build

# 3. Wait for seeding (~30-60 seconds)
# Services will be ready when you see:
# "Application startup complete"

# 4. Access:
# - API:      http://localhost:8000
# - Frontend: http://localhost:3000
# - Health:   http://localhost:8000/api/health
```

### Option 2: Local Development

#### Backend Setup

```bash
# Create virtual environment
python3.12 -m venv .venv
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment (copy and edit)
cp .env.example .env

# Start PostgreSQL and Redis (using Docker)
docker run -d -p 5432:5432 \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=datatable_db \
  postgres:16-alpine

docker run -d -p 6379:6379 redis:7-alpine

# Seed database
python api/seed.py

# Start FastAPI server
uvicorn api.app:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install  # or pnpm install

# Start development server
npm run dev  # or pnpm dev

# Open http://localhost:3000
```

## ⚡ Performance Optimization

### Backend Optimizations

#### 1. **Database Indexing**

```sql
-- Strategic indexes on frequently queried columns
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_users_country ON users(country);
CREATE INDEX idx_users_signup_date ON users(signup_date);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_product_id ON orders(product_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_transactions_status ON transactions(status);
```

#### 2. **Redis Caching Strategy**

- **TTL**: 5 minutes per cached response
- **Cache Key**: Hash of (endpoint + params + page)
- **Hit Rate**: ~80% on typical usage
- **Invalidation**: TTL-based (automatic)

```python
# Cache implementation
cache_key = f"products:p={page}:ps={page_size}:s={search}:sb={sort_by}:so={sort_order}"
cached = get_cached(cache_key)
if cached:
    return cached  # <5ms response
else:
    result = query_db()
    set_cache(cache_key, result, ttl=300)
    return result  # ~50-100ms response
```

#### 3. **Query Optimization**

- **Offset/Limit Pagination**: Efficient for pagination UI
- **Early Filtering**: Filter before limit to avoid large result sets
- **Connection Pooling**: 20 connections per process, 40 overflow
- **Lazy Loading**: Only fetch required fields

#### 4. **Response Time Breakdown** (Typical)

| Step                 | Time       |
| -------------------- | ---------- |
| Request parsing      | ~1ms       |
| Cache lookup         | ~2ms       |
| DB query             | ~30-50ms   |
| Result serialization | ~5ms       |
| Network overhead     | ~5-10ms    |
| **Total**            | **<100ms** |

### Frontend Optimizations

#### 1. **Responsive Design**

- Mobile-first approach with Tailwind breakpoints
- Breakpoints: `default` (mobile), `sm:` (640px), `md:` (768px), `lg:` (1024px)
- Dynamic layouts that adapt to screen size

#### 2. **Light Theme for Readability**

- Background: `#f8fafc` (light gray)
- Text: `#1f2937` (dark gray-800)
- Accent: `#2563eb` (blue-600)
- Ensures excellent contrast and accessibility

#### 3. **Component Architecture**

- **DataTable Component**: Reusable, type-safe, generic
- **Mobile Menu**: Hamburger navigation (hidden on desktop)
- **Layout System**: Consistent spacing and typography
- **Error Handling**: Retry mechanisms and user-friendly messages

#### 4. **Loading States & Error Handling**

- Skeleton loaders while fetching
- Graceful error display with retry buttons
- Empty state when no results
- Loading indicator with context

#### 5. **Pagination UI**

- Smart page number display (shows first, surrounding, last)
- Active page highlighted in blue
- Ellipsis (...) for gap indication
- Navigation arrows (previous/next)
- Page size selector (10, 25, 50, 100 records)

## 🔌 API Endpoints

### Products

```bash
GET /api/products?page=1&page_size=50&sort_by=created_at&sort_order=desc&search=laptop

Response: {
  "total": 1000,
  "page": 1,
  "page_size": 50,
  "total_pages": 20,
  "data": [{id, sku, name, category, price, stock, created_at}],
  "response_time_ms": 45.23
}
```

### Users

```bash
GET /api/users?page=1&page_size=50&country=US&sort_by=lifetime_value

Response: {
  "total": 5000,
  "page": 1,
  "page_size": 50,
  "total_pages": 100,
  "data": [{id, email, name, country, signup_date, total_orders, lifetime_value}],
  "response_time_ms": 52.15
}
```

### Orders

```bash
GET /api/orders?page=1&page_size=50&status=completed&sort_by=order_date

Response: {
  "total": 100000,
  "page": 1,
  "page_size": 50,
  "total_pages": 2000,
  "data": [{id, user_id, product_id, quantity, total_price, status, order_date}],
  "response_time_ms": 68.42
}
```

### Transactions

```bash
GET /api/transactions?page=1&page_size=50&status=completed

Response: {
  "total": 100000,
  "page": 1,
  "page_size": 50,
  "total_pages": 2000,
  "data": [{id, order_id, amount, currency, payment_method, status, transaction_date}],
  "response_time_ms": 71.38
}
```

### Health Check

```bash
GET /api/health

Response: { "status": "ok" }
```

## 🎨 Frontend Features

### Home Page

- **Hero Section**: Dynamic headline with call-to-action buttons
- **Stats Grid**: Shows key metrics (206K+ records, <100ms response time, 4 endpoints)
- **Features Section**: Highlights architecture benefits (caching, filtering, modern stack)
- **Data Tables Preview**: Links to each table with emoji indicators
- **CTA Section**: Final call-to-action to explore data
- **Full Responsive**: Mobile, tablet, and desktop layouts

### Data Tables

- **Real-time Search**: Debounced search across all fields (500ms debounce)
- **Smart Sorting**: Click column headers to sort (ascending/descending toggle)
- **Pagination**: Smart page number display with navigation
- **Page Size Selector**: Choose 10, 25, 50, or 100 records per page
- **Response Time Display**: Shows actual API response time
- **Error Handling**: Retry mechanism with error messages
- **Loading States**: Spinner animation while fetching
- **Empty States**: User-friendly message when no data
- **Type Safety**: Full TypeScript support throughout

### Navigation

- **Logo**: Consistent ⚡ icon in blue box across all pages
- **Navigation Bar**: Links to all table pages
- **Mobile Menu**: Hamburger menu on small screens
- **Responsive**: Auto-adjusts for all screen sizes

## 🎯 UI/UX Considerations

### 1. **Visual Hierarchy**

- Large, bold headings (up to `text-7xl`)
- Descriptive subheadings in gray
- Clear action buttons (blue primary, white secondary)
- Icons for quick recognition

### 2. **Responsive Design**

- **Mobile**: Single column, full-width buttons, optimized touch targets
- **Tablet**: 2-column grids, balanced spacing
- **Desktop**: 4-column grids, full feature set
- All text scales appropriately for readability

### 3. **Accessibility**

- High contrast text (`#1f2937` on `#f8fafc`)
- Semantic HTML structure
- Keyboard navigation support
- ARIA labels where needed
- Touch-friendly button sizes (minimum 8x8 for page buttons)

### 4. **Performance UX**

- Instant feedback on user actions (button states)
- Progressive loading (show skeleton while fetching)
- Response time display builds confidence
- Retry buttons reduce user frustration

### 5. **Consistency**

- Uniform spacing using Tailwind scale
- Consistent color palette (blue accent, gray text)
- Rounded corners (lg: 8px, rounded-lg)
- Glass-morphism effects with opacity

### 6. **Error & Edge Cases**

- Network error handling with retry
- Empty state messaging
- Loading states (spinner, text)
- Disabled pagination buttons at boundaries
- Clear validation messages

## 📊 Database Schema

### Products (1,000 records)

```sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  sku VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  stock INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Users (5,000 records)

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  country VARCHAR(100) NOT NULL,
  signup_date DATE NOT NULL,
  total_orders INT DEFAULT 0,
  lifetime_value DECIMAL(12, 2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Orders (100,000 records)

```sql
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id),
  product_id INT NOT NULL REFERENCES products(id),
  quantity INT NOT NULL,
  total_price DECIMAL(12, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Transactions (100,000 records)

```sql
CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  order_id INT NOT NULL REFERENCES orders(id),
  amount DECIMAL(12, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  payment_method VARCHAR(50) NOT NULL,
  status VARCHAR(50) DEFAULT 'completed',
  transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🔮 Future Improvements

### Performance Enhancements (with more time)

With additional development time, I would focus on three key areas. First, **advanced caching strategies**: implementing query-result caching with cache warming for popular searches, implementing Elasticsearch for full-text search instead of database LIKE queries (could improve search performance from ~100ms to ~20ms), and adding a write-through cache for mutations. This would reduce response times to consistently sub-50ms even under peak load. Second, **database optimization**: implementing materialized views for complex queries, adding read replicas for load distribution, and implementing connection pooling optimization with better timeout tuning. Finally, **frontend optimization**: implementing virtual scrolling (windowing) for tables showing millions of records without re-rendering all rows, adding WebSocket support for real-time data updates and streaming large datasets, and implementing progressive loading with intersection observers for infinite scroll support.

### Feature Enhancements (with more time)

Beyond performance, I would prioritize three major feature areas to make this production-ready. First, **authentication & authorization**: implementing role-based access control (RBAC) with JWT tokens, row-level security for multi-tenant scenarios, and audit logging for compliance. Second, **data management**: adding export functionality (CSV, Excel, JSON), bulk operations for editing multiple records, and undo/redo capabilities. Third, **monitoring & observability**: implementing comprehensive logging (structured JSON logs with correlation IDs), distributed tracing with OpenTelemetry, metrics collection (latency histograms, cache hit rates, error rates), and a real-time dashboard showing application health. Additionally, I would add integration tests for the API endpoints, end-to-end tests for critical user flows, and performance benchmarking tests to prevent regressions as the codebase evolves.

## 📁 Project Structure

```
.
├── api/
│   ├── __init__.py
│   ├── app.py              # FastAPI application & endpoints
│   ├── models.py           # SQLAlchemy ORM models
│   ├── database.py         # Database configuration & session
│   ├── cache.py            # Redis caching utilities
│   ├── schemas.py          # Pydantic validation schemas
│   ├── seed.py             # Database seeding script
│   └── routers/
│       ├── products.py     # Products endpoint
│       ├── users.py        # Users endpoint
│       ├── orders.py       # Orders endpoint
│       └── transactions.py # Transactions endpoint
├── frontend/
│   ├── app/
│   │   ├── layout.tsx      # Root layout with navigation
│   │   ├── page.tsx        # Home page (landing)
│   │   ├── products/page.tsx
│   │   ├── users/page.tsx
│   │   ├── orders/page.tsx
│   │   └── transactions/page.tsx
│   ├── components/
│   │   ├── data-table.tsx  # Reusable data table component
│   │   ├── mobile-menu.tsx # Mobile navigation menu
│   │   └── ui/             # Shadcn UI components
│   ├── lib/
│   │   ├── api.ts          # API client & types
│   │   └── utils.ts        # Utility functions
│   └── public/             # Static assets
├── docker-compose.yml      # Multi-container orchestration
├── Dockerfile              # Backend container image
├── requirements.txt        # Python dependencies
├── package.json            # Frontend dependencies
└── README.md              # This file
```

## 🐛 Troubleshooting

### Port Already in Use

```bash
# macOS/Linux
lsof -ti:8000 | xargs kill -9
lsof -ti:5432 | xargs kill -9
lsof -ti:6379 | xargs kill -9

# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

### Database Connection Errors

```bash
# Verify services are running
docker ps

# Check PostgreSQL logs
docker logs <postgres-container-id>

# Test connection
psql -h localhost -U postgres -d datatable_db
```

### Slow API Responses

- Check Redis is running: `redis-cli ping` should return `PONG`
- Verify database indexes are created: `\d products` in psql
- Monitor with: `SELECT * FROM pg_stat_statements;`

### Frontend Not Loading

- Ensure port 3000 is available: `lsof -ti:3000`
- Check environment variables in `.env.local`
- Clear Next.js cache: `rm -rf .next`

## 📝 License

MIT

## 💬 Support

For issues or questions:

1. Check the troubleshooting section above
2. Review API documentation at `/docs` (when running locally)
3. Check application logs: `docker compose logs -f`
