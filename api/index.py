import os
import sys

# Add backend directory to path for Vercel serverless runtime
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend")))

from app.main import app

# Export ASGI handler for Vercel Serverless
__all__ = ["app"]
