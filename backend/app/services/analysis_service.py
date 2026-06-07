from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.clients.github_client import github_client
from app.clients.openai_client import openai_client
from app.models.analysis import Analysis
from app.repositories.analysis_repository import AnalysisRepository
from app.schemas.analysis import AnalysisRequest, AnalysisResponse, ChangedFile
from app.services.fallback_analysis import build_fallback_analysis
from app.services.github_url_parser import parse_github_pr_url
from app.services.pr_file_processor import build_changed_files_summary
from app.services.prompt_builder import build_pull_request_prompt


class AnalysisService:
    """
    Service responsible for orchestrating the Pull Request analysis flow.

    This service coordinates URL parsing, GitHub API calls,
    prompt construction, AI analysis, fallback handling,
    database persistence, and response construction.
    """

    async def analyze_pull_request(
        self,
        payload: AnalysisRequest,
        db: Session,
    ) -> AnalysisResponse:
        """
        Analyze a GitHub Pull Request.

        This method fetches Pull Request data from GitHub, builds an
        AI-ready prompt, tries to analyze it with OpenAI, falls back
        to a local analysis if needed, saves the result in the database,
        and returns a structured response.
        """

        pr_info = parse_github_pr_url(str(payload.pr_url))

        pull_request = await github_client.get_pull_request(
            owner=pr_info.owner,
            repo=pr_info.repo,
            pr_number=pr_info.pr_number,
        )

        files = await github_client.get_pull_request_files(
            owner=pr_info.owner,
            repo=pr_info.repo,
            pr_number=pr_info.pr_number,
        )

        changed_files_summary = build_changed_files_summary(files)

        prompt = build_pull_request_prompt(
            repository=f"{pr_info.owner}/{pr_info.repo}",
            pr_title=pull_request.get("title", ""),
            pr_author=pull_request.get("user", {}).get("login", ""),
            changed_files=changed_files_summary,
        )

        try:
            ai_response = await openai_client.analyze_pull_request(prompt)

            analysis_result = {
                "summary": ai_response,
                "risks": [
                    "AI risk analysis will be structured in the next iteration.",
                ],
                "suggested_tests": [
                    "AI test suggestions will be structured in the next iteration.",
                ],
                "review_checklist": [
                    "AI review checklist will be structured in the next iteration.",
                ],
                "impact_level": "medium",
            }

        except HTTPException as error:
            if error.status_code != status.HTTP_429_TOO_MANY_REQUESTS:
                raise

            analysis_result = build_fallback_analysis(
                repository=f"{pr_info.owner}/{pr_info.repo}",
                pr_title=pull_request.get("title", ""),
                files_count=len(files),
                additions=pull_request.get("additions", 0),
                deletions=pull_request.get("deletions", 0),
            )

        changed_files = [
            {
                "filename": file.get("filename", "unknown"),
                "status": file.get("status", "modified"),
                "additions": file.get("additions", 0),
                "deletions": file.get("deletions", 0),
                "patch": file.get("patch", ""),
            }
            for file in files
        ]

        main_changes = [
            f"{len(files)} files changed",
            f"{pull_request.get('additions', 0)} additions",
            f"{pull_request.get('deletions', 0)} deletions",
        ]

        analysis_model = Analysis(
            pr_url=str(payload.pr_url),
            repository=f"{pr_info.owner}/{pr_info.repo}",
            pr_number=pr_info.pr_number,
            pr_title=pull_request.get("title", ""),
            pr_author=pull_request.get("user", {}).get("login", ""),
            summary=analysis_result["summary"],
            main_changes=main_changes,
            risks=analysis_result["risks"],
            suggested_tests=analysis_result["suggested_tests"],
            review_checklist=analysis_result["review_checklist"],
            changed_files=changed_files,
            impact_level=analysis_result["impact_level"],
            files_changed=len(files),
            additions=pull_request.get("additions", 0),
            deletions=pull_request.get("deletions", 0),
            commits=pull_request.get("commits", 0),
        )

        saved_analysis = AnalysisRepository.create(
            db=db,
            analysis=analysis_model,
        )

        return AnalysisResponse(
            id=saved_analysis.id,
            pr_url=saved_analysis.pr_url,
            repository=saved_analysis.repository,
            pr_number=saved_analysis.pr_number,
            pr_title=saved_analysis.pr_title,
            pr_author=saved_analysis.pr_author,
            files_changed=saved_analysis.files_changed,
            additions=saved_analysis.additions,
            deletions=saved_analysis.deletions,
            commits=saved_analysis.commits,
            changed_files=[
                ChangedFile(**file)
                for file in saved_analysis.changed_files
            ],
            summary=saved_analysis.summary,
            main_changes=saved_analysis.main_changes,
            risks=saved_analysis.risks,
            suggested_tests=saved_analysis.suggested_tests,
            review_checklist=saved_analysis.review_checklist,
            impact_level=saved_analysis.impact_level,
        )


analysis_service = AnalysisService()