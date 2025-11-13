"""Main FastAPI application with modular route handlers."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.database import init_db
from api.routers import products, users, orders, transactions

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


# Register all routers
app.include_router(products.router)
app.include_router(users.router)
app.include_router(orders.router)
app.include_router(transactions.router)

# Entry point for running the application directly
if __name__ == "__main__":
    import uvicorn
    # Start the server on all network interfaces (0.0.0.0) on port 8000
    uvicorn.run(app, host="0.0.0.0", port=8000)
