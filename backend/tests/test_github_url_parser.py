import pytest
from fastapi import HTTPException

from app.services.github_url_parser import parse_github_pr_url


def test_parse_valid_github_pr_url():
    result = parse_github_pr_url(
        "https://github.com/fastapi/fastapi/pull/15613"
    )

    assert result.owner == "fastapi"
    assert result.repo == "fastapi"
    assert result.pr_number == 15613


def test_rejects_non_github_url():
    with pytest.raises(HTTPException):
        parse_github_pr_url("https://example.com/test")


def test_rejects_non_pull_request_url():
    with pytest.raises(HTTPException):
        parse_github_pr_url("https://github.com/fastapi/fastapi/issues/1")