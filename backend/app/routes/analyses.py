from fastapi import APIRouter
from fastapi import Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.repositories.analysis_repository import AnalysisRepository
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
async def analyze_pull_request(
    payload: AnalysisRequest,
    db: Session = Depends(get_db),
):
    """
    Analyze a public GitHub Pull Request using AI.

    The route only handles the HTTP layer.
    Business logic is delegated to the service layer.
    """

    return await analysis_service.analyze_pull_request(
        payload=payload,
        db=db,
    )


@router.get("")
async def get_analyses(
    db: Session = Depends(get_db),
):
    """
    Retrieve all stored Pull Request analyses.
    """

    analyses = AnalysisRepository.get_all(db)

    return [
        {
            "id": analysis.id,
            "pr_url": analysis.pr_url,
            "repository": analysis.repository,
            "pr_number": analysis.pr_number,
            "pr_title": analysis.pr_title,
            "pr_author": analysis.pr_author,
            "summary": analysis.summary,
            "main_changes": analysis.main_changes,
            "risks": analysis.risks,
            "suggested_tests": analysis.suggested_tests,
            "review_checklist": analysis.review_checklist,
            "changed_files": analysis.changed_files,
            "impact_level": analysis.impact_level,
            "files_changed": analysis.files_changed,
            "additions": analysis.additions,
            "deletions": analysis.deletions,
            "commits": analysis.commits,
            "created_at": analysis.created_at.isoformat(),
        }
        for analysis in analyses
    ]