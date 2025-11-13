FROM python:3.12-slim

WORKDIR /app

# Copy everything first
COPY . .

# Copy requirements and install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Expose port
EXPOSE 8000

# Default command
CMD ["sh", "-c", "python -m api.seed && uvicorn api.app:app --host 0.0.0.0 --port 8000"]
