import httpx
from fastapi import HTTPException, status

from app.core.settings import settings


class GitHubClient:
    """
    Client responsible for communicating with the GitHub API.

    Keeping GitHub-specific HTTP logic in this class prevents
    external API details from leaking into the service layer.
    """

    BASE_URL = "https://api.github.com"

    def _get_headers(self) -> dict[str, str]:
        """
        Build request headers for GitHub API calls.

        If a GitHub token is configured, it is added to increase
        rate limits and support authenticated requests.
        """

        headers = {
            "Accept": "application/vnd.github+json",
        }

        if settings.github_token:
            headers["Authorization"] = f"Bearer {settings.github_token}"

        return headers

    async def get_pull_request(
        self,
        owner: str,
        repo: str,
        pr_number: int,
    ) -> dict:
        """
        Fetch Pull Request metadata from GitHub.

        This returns general PR information such as title,
        body, author, additions, deletions and changed files.
        """

        url = f"{self.BASE_URL}/repos/{owner}/{repo}/pulls/{pr_number}"

        async with httpx.AsyncClient() as client:
            response = await client.get(
                url,
                headers=self._get_headers(),
                timeout=15,
            )

        if response.status_code == 404:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Pull Request not found.",
            )

        if response.status_code == 403:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="GitHub API rate limit exceeded or access forbidden.",
            )

        if response.status_code >= 400:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail="Unexpected error while calling GitHub API.",
            )

        return response.json()

    async def get_pull_request_files(
        self,
        owner: str,
        repo: str,
        pr_number: int,
    ) -> list[dict]:
        """
        Fetch files changed in a Pull Request.

        This returns file-level information such as filename,
        status, additions, deletions and patch content.
        """

        url = f"{self.BASE_URL}/repos/{owner}/{repo}/pulls/{pr_number}/files"

        async with httpx.AsyncClient() as client:
            response = await client.get(
                url,
                headers=self._get_headers(),
                timeout=15,
            )

        if response.status_code == 404:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Pull Request files not found.",
            )

        if response.status_code == 403:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="GitHub API rate limit exceeded or access forbidden.",
            )

        if response.status_code >= 400:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail="Unexpected error while calling GitHub API.",
            )

        return response.json()


github_client = GitHubClient()