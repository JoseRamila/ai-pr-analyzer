from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.settings import settings
from app.routes.analyses import router as analyses_router
from app.routes.health import router as health_router

# Creates the FastAPI application instance.
# This is the central entry point of the backend.
app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
)

# Allows the React frontend to communicate with the FastAPI backend
# during local development.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registers the health check routes.
# Keeping routes in separate files helps maintain a clean and scalable structure.
app.include_router(health_router)

# Registers the Pull Request analysis routes.
app.include_router(analyses_router)