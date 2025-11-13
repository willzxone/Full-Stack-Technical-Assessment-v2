FROM python:3.12-slim

WORKDIR /app

# Install minimal system dependencies with retries
RUN apt-get update --fix-missing || true && \
    apt-get install -y --no-install-recommends \
    curl \
    || true

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=10s --timeout=5s --retries=3 \
    CMD python -c "import requests; requests.get('http://localhost:8000/api/health')"

# Default command
CMD ["uvicorn", "api.app:app", "--host", "0.0.0.0", "--port", "8000"]
