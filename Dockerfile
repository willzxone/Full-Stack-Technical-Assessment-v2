FROM python:3.12-slim

WORKDIR /app

# Dependencies will be installed at runtime via docker-compose
# Code will be mounted as a volume

# Expose port
EXPOSE 8000

# Default command (can be overridden in docker-compose)
CMD ["uvicorn", "api.app:app", "--host", "0.0.0.0", "--port", "8000"]
