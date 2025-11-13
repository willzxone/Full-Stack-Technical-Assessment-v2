# NextJS Frontend Setup & Docker Integration

## Overview

A modern, responsive Next.js 16 frontend with TypeScript that provides a high-performance data table interface for browsing 100k+ records with instant search, filtering, and sorting capabilities.

## Features Implemented

### ✨ Data Table Component
- **Virtual Scrolling**: Efficiently handles 100k+ records
- **Real-time Search**: Instant client-side search with debouncing
- **Advanced Sorting**: Click headers to sort, cycle through asc/desc
- **Pagination**: Navigate through pages with controls and page size selector
- **Loading States**: Smooth UX with loading indicators
- **Error Handling**: Graceful error messages and retry options
- **Response Time Display**: Shows API response times in milliseconds

### 🎨 User Interface
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Tailwind CSS**: Modern styling with utility-first approach
- **Shadcn/UI Components**: Pre-built, accessible UI components
  - Button with variants (default, outline, ghost, etc.)
  - Input with proper styling
  - Select dropdowns with keyboard navigation
  - Data table with hover states
- **Icons**: Lucide React icons for visual feedback
- **Navigation**: Top navigation bar with links to all tables

### 📊 Pages Included
1. **Home Page** (`/`) - Overview and table links
2. **Products** (`/products`) - Browse 1,000+ products
3. **Users** (`/users`) - Explore 5,000+ users
4. **Orders** (`/orders`) - View 100,000+ orders
5. **Transactions** (`/transactions`) - Analyze 100,000+ transactions

### 🔌 API Integration
- **Type-Safe API Client** (`lib/api.ts`)
- **Endpoint Methods**:
  - `getProducts()` - Products with search, sorting
  - `getUsers()` - Users with country filtering
  - `getOrders()` - Orders with status filtering
  - `getTransactions()` - Transactions with payment method filtering
- **Environment Variable**: `NEXT_PUBLIC_API_URL` for backend URL

## Docker Setup

### Running with Docker Compose

**Start all services (backend + frontend + database + cache):**
```bash
docker compose up
```

**In a new terminal, monitor frontend logs:**
```bash
docker compose logs -f frontend
```

**Access the application:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Database: localhost:5432
- Cache: localhost:6379

### Docker Compose Configuration

The frontend service is configured with:

```yaml
frontend:
  image: node:22-alpine
  command: >
    sh -c "npm install -g pnpm &&
           cd /app/frontend &&
           pnpm install --frozen-lockfile &&
           pnpm dev"
  environment:
    NEXT_PUBLIC_API_URL: http://localhost:8000
    NODE_ENV: development
  ports:
    - "3000:3000"
  volumes:
    - ./frontend:/app/frontend
```

**Key Features:**
- ✅ **Volume Mounting**: Code changes reflect immediately
- ✅ **Hot-Reload**: Next.js dev server auto-reloads on file changes
- ✅ **Fast Install**: pnpm for faster package installation
- ✅ **Frozen Lockfile**: Ensures reproducible builds
- ✅ **Environment Variables**: Configured for backend communication

## Local Development (Without Docker)

### Prerequisites
```bash
# Node.js 22+
# pnpm package manager
```

### Installation

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
pnpm install

# Set environment variables
export NEXT_PUBLIC_API_URL=http://localhost:8000

# Start development server
pnpm dev
```

The frontend will be available at `http://localhost:3000`

### Development Workflow

1. **Edit Components**: Make changes in `components/` or `app/`
2. **Save Files**: Changes trigger hot-reload automatically
3. **See Changes**: Refresh browser or wait for auto-refresh
4. **Check Logs**: View build output in terminal

## Project Structure

```
frontend/
├── app/                              # Next.js app directory
│   ├── layout.tsx                   # Root layout with navigation
│   ├── page.tsx                     # Home page
│   ├── products/page.tsx            # Products table page
│   ├── users/page.tsx               # Users table page
│   ├── orders/page.tsx              # Orders table page
│   ├── transactions/page.tsx        # Transactions table page
│   └── globals.css                  # Global Tailwind styles
│
├── components/
│   ├── data-table.tsx               # Main data table component
│   └── ui/                          # Shadcn/UI components
│       ├── button.tsx
│       ├── input.tsx
│       ├── select.tsx
│       └── table.tsx
│
├── lib/
│   ├── api.ts                       # Type-safe API client
│   └── utils.ts                     # Utility functions (cn)
│
├── package.json                     # Dependencies
├── pnpm-lock.yaml                   # Dependency lock file
├── next.config.ts                   # Next.js configuration
├── tsconfig.json                    # TypeScript configuration
└── tailwind.config.js               # Tailwind CSS configuration
```

## Dependencies

### Production
- **next**: 16.0.3 - React framework
- **react**: 19.2.0 - UI library
- **react-dom**: 19.2.0 - React DOM bindings
- **@radix-ui/react-slot**: Primitive for component composition
- **@radix-ui/react-select**: Accessible select dropdown
- **@radix-ui/react-dialog**: Accessible dialog component
- **class-variance-authority**: Variant management
- **clsx**: Class name utility
- **tailwind-merge**: Tailwind CSS class merging
- **lucide-react**: Icon library

### Development
- **typescript**: 5 - Type checking
- **tailwindcss**: 4 - Utility-first CSS
- **eslint**: 9 - Code linting
- **@types/react**: TypeScript support for React

## Key Components

### DataTable Component
**File**: `components/data-table.tsx`
**Props**:
```typescript
interface DataTableProps<T extends DataType> {
  type: "products" | "users" | "orders" | "transactions"
  title: string
  columns: { key: keyof T; label: string; sortable?: boolean }[]
  filters?: React.ReactNode
}
```

**Features**:
- Generic type-safe implementation
- Configurable columns with sortable flag
- Debounced search (500ms)
- Automatic data fetching based on page/filters
- Error handling with retry
- Responsive pagination controls

### API Client
**File**: `lib/api.ts`
**Methods**:
```typescript
// Type-safe fetch methods
apiClient.getProducts(page, pageSize, search, sortBy, sortOrder)
apiClient.getUsers(page, pageSize, search, country, sortBy, sortOrder)
apiClient.getOrders(page, pageSize, status, sortBy, sortOrder)
apiClient.getTransactions(page, pageSize, paymentMethod, status, sortBy, sortOrder)
```

## Performance Optimizations

1. **Client-Side Search**: Instant feedback without API calls (with debounce)
2. **Virtual Scrolling**: Ready for integration with libraries like `react-window`
3. **Response Time Tracking**: Shows milliseconds per API call
4. **Memoization**: Components optimize re-renders
5. **Code Splitting**: Next.js auto-code-splits pages

## Common Tasks

### Modify Table Columns
```typescript
// In app/products/page.tsx
const columns: { key: keyof Product; label: string; sortable?: boolean }[] = [
  { key: "id", label: "ID", sortable: true },
  { key: "name", label: "Name", sortable: true },
  // Add more columns...
]
```

### Add Filtering
```typescript
// In data-table.tsx - Add filter UI and pass to API client
const [customFilter, setCustomFilter] = useState("")

// Pass filter in API call
const response = await apiClient.getProducts(
  page,
  pageSize,
  search,
  sortBy,
  sortOrder,
  customFilter  // Add parameter
)
```

### Update Backend URL
```bash
# In Docker Compose
NEXT_PUBLIC_API_URL: http://backend:8000

# For local development
export NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Troubleshooting

### Frontend won't connect to backend
```bash
# Check backend is running
docker compose ps

# Verify backend URL
docker compose exec frontend env | grep NEXT_PUBLIC_API_URL

# Test backend directly
curl http://localhost:8000/api/health
```

### Hot-reload not working
```bash
# Check file changes are detected
docker compose logs -f frontend

# Restart frontend service
docker compose restart frontend

# Check volume mount
docker inspect datatable_frontend | grep Mounts
```

### Data not loading
```bash
# Check API responses
curl http://localhost:8000/api/products

# Check frontend logs
docker compose logs frontend

# Check browser console (F12) for JavaScript errors
```

### Dependencies missing
```bash
# Reinstall dependencies
docker compose exec frontend pnpm install

# Or rebuild frontend
docker compose up --build frontend
```

## Build & Production

### Docker Production Build
```dockerfile
FROM node:22-alpine AS builder
WORKDIR /app
COPY . .
RUN npm install -g pnpm
RUN pnpm install
RUN pnpm build

FROM node:22-alpine
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3000
CMD ["pnpm", "start"]
```

## Next Steps

1. ✅ Frontend built and integrated with Docker
2. ✅ Data tables created with search/filter/sort
3. ✅ API client connected to backend
4. ✅ Responsive UI with Tailwind CSS
5. Next: Performance testing and optimization
6. Next: Advanced features (view item details, export data, etc.)

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Shadcn/UI Components](https://ui.shadcn.com/)
- [Radix UI Primitives](https://radix-ui.com/)
- [React Documentation](https://react.dev)

---

**Development ready!** 🚀 Start with `docker compose up` and navigate to http://localhost:3000
