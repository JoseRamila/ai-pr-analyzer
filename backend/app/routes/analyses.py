from fastapi import APIRouter

from app.schemas.analysis import (
    AnalysisRequest,
    AnalysisResponse,
)
from app.services.analysis_service import analysis_service

# APIRouter groups all analysis-related endpoints.
# This keeps the application modular and scalable.

router = APIRouter(
    prefix="/analyses",
    tags=["Analyses"],
)


@router.post("", response_model=AnalysisResponse)
async def analyze_pull_request(payload: AnalysisRequest):
    """
    Analyze a public GitHub Pull Request using AI.

    The route only handles the HTTP layer.
    Business logic is delegated to the service layer.
    """

    return await analysis_service.analyze_pull_request(payload)