from fastapi import HTTPException, status

from app.clients.github_client import github_client
from app.clients.openai_client import openai_client
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
    and response construction.
    """

    async def analyze_pull_request(
        self,
        payload: AnalysisRequest,
    ) -> AnalysisResponse:
        """
        Analyze a GitHub Pull Request.

        This method fetches Pull Request data from GitHub, builds an
        AI-ready prompt, tries to analyze it with OpenAI, and falls back
        to a local analysis if the AI provider is unavailable.
        """

        # Parse and validate the GitHub Pull Request URL.
        pr_info = parse_github_pr_url(str(payload.pr_url))

        # Fetch Pull Request metadata from GitHub API.
        pull_request = await github_client.get_pull_request(
            owner=pr_info.owner,
            repo=pr_info.repo,
            pr_number=pr_info.pr_number,
        )

        # Fetch all changed files from the Pull Request.
        files = await github_client.get_pull_request_files(
            owner=pr_info.owner,
            repo=pr_info.repo,
            pr_number=pr_info.pr_number,
        )

        # Build a structured summary of changed files and patch previews.
        changed_files_summary = build_changed_files_summary(files)

        # Build an AI-ready prompt using GitHub data.
        prompt = build_pull_request_prompt(
            repository=f"{pr_info.owner}/{pr_info.repo}",
            pr_title=pull_request.get("title", ""),
            pr_author=pull_request.get("user", {}).get("login", ""),
            changed_files=changed_files_summary,
        )

        try:
            # Try to get a real AI-generated analysis from OpenAI.
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
            # Only fallback when OpenAI quota/rate limit is unavailable.
            # Other HTTP errors should still be raised.
            if error.status_code != status.HTTP_429_TOO_MANY_REQUESTS:
                raise

            analysis_result = build_fallback_analysis(
                repository=f"{pr_info.owner}/{pr_info.repo}",
                pr_title=pull_request.get("title", ""),
                files_count=len(files),
                additions=pull_request.get("additions", 0),
                deletions=pull_request.get("deletions", 0),
            )

        return AnalysisResponse(
            id=1,
            pr_url=str(payload.pr_url),
            repository=f"{pr_info.owner}/{pr_info.repo}",
            pr_number=pr_info.pr_number,
            pr_title=pull_request.get("title", ""),
            pr_author=pull_request.get("user", {}).get("login", ""),

            files_changed=len(files),
            additions=pull_request.get("additions", 0),
            deletions=pull_request.get("deletions", 0),
            commits=pull_request.get("commits", 0),

            changed_files=[
                ChangedFile(
                    filename=file.get("filename", "unknown"),
                    status=file.get("status", "modified"),
                    additions=file.get("additions", 0),
                    deletions=file.get("deletions", 0),
                )
                for file in files
            ],

            summary=analysis_result["summary"],
            main_changes=[
                f"{len(files)} files changed",
                f"{pull_request.get('additions', 0)} additions",
                f"{pull_request.get('deletions', 0)} deletions",
            ],
            risks=analysis_result["risks"],
            suggested_tests=analysis_result["suggested_tests"],
            review_checklist=analysis_result["review_checklist"],
            impact_level=analysis_result["impact_level"],
        )


analysis_service = AnalysisService()