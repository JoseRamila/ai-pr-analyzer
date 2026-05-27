from dataclasses import dataclass
from urllib.parse import urlparse

from fastapi import HTTPException, status

@dataclass
class GitHubPullRequestInfo:
    """
    Structured representation of a GitHub Pull Request URL.

    This object contains only the minimum information required
    to request Pull Request data from the GitHub API.
    """

    owner: str
    repo: str
    pr_number: int

def parse_github_pr_url(pr_url: str) -> GitHubPullRequestInfo:
    """
    Parse and validate a public GitHub Pull Request URL.

    Expected format:
    https://github.com/{owner}/{repo}/pull/{pr_number}
    """

    parse_url = urlparse(pr_url)

    if parse_url.netloc != "github.com":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail = "Only github.com Pull Request URLs are supported" 
        )
    
    path_parts = parse_url.path.strip("/").split("/")

    if len(path_parts) != 4 or path_parts[2] != "pull":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid GitHub Pull Request URL format"
        )
    
    owner = path_parts[0]
    repo = path_parts[1]
    pr_number_raw = path_parts[3]

    if not pr_number_raw.isdigit():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Pull Request number must be numeric"
        )
    
    return GitHubPullRequestInfo(
        owner=owner,
        repo=repo,
        pr_number=int(pr_number_raw),
    )
        
