#!/usr/bin/env bash
# Small helper to run the FastAPI app with uvicorn from the project root
set -euo pipefail

# Default host and port
HOST=${HOST:-0.0.0.0}
PORT=${PORT:-8000}

echo "Starting uvicorn on ${HOST}:${PORT} (app=api.app:app)"
exec uvicorn api.app:app --host "$HOST" --port "$PORT" --reload
