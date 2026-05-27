from typing import List

from pydantic import BaseModel, HttpUrl


class AnalysisRequest(BaseModel):
    """
    Request schema for analyzing a GitHub Pull Request.

    The user sends a public GitHub PR URL that will be processed
    by the backend and analyzed using AI.
    """

    pr_url: HttpUrl


class AnalysisResponse(BaseModel):
    """
    Response schema returned after analyzing a Pull Request.

    Contains AI-generated insights and metadata extracted
    from the GitHub Pull Request.
    """

    id: int
    pr_url: str

    repository: str
    pr_number: int

    pr_title: str
    pr_author: str

    summary: str

    main_changes: List[str]
    risks: List[str]

    suggested_tests: List[str]

    review_checklist: List[str]

    impact_level: str