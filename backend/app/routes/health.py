from fastapi import APIRouter

# APIRouter allows us to group related endpoints outside of main.py
# This keeps the application modular as it grows

router  = APIRouter()

@router.get("/health")
async def health_check():
    """
    Health check endpoint.

    Used to verify that the API is running correctly.
    This is useful for local testing, Docker, deployment platforms,
    and monitoring tools.
    """
    
    return {"status": "ok"}