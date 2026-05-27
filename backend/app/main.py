from fastapi import FastAPI

from app.core.settings import settings
from app.routes.health import router as health_router
from app.routes.analyses import router as analyses_router

# Creates the FastAPI application instance
# This is the central entry point of backend

app = FastAPI(
    title= settings.app_name,
    version= settings.app_version,
)

# Registers the health check routes
# Keeping routes in separates files helps maintain a clean and scalable structure

app.include_router(health_router)
app.include_router(analyses_router)
