def build_fallback_analysis(
    repository: str,
    pr_title: str,
    files_count: int,
    additions: int,
    deletions: int,
) -> dict:
    """
    Build a local fallback analysis when the AI provider is unavailable.

    This keeps the API usable during development or when OpenAI quota
    is exceeded, while preserving the same response structure.
    """

    impact_level = "low"

    if files_count > 5 or additions > 300 or deletions > 300:
        impact_level = "high"
    elif files_count > 2 or additions > 100 or deletions > 100:
        impact_level = "medium"

    return {
        "summary": (
            f"This Pull Request in {repository} modifies {files_count} file(s). "
            f"It includes {additions} additions and {deletions} deletions. "
            f"PR title: {pr_title}."
        ),
        "risks": [
            "AI analysis is currently unavailable, so risks are estimated locally.",
            "Review changed files manually before merging.",
        ],
        "suggested_tests": [
            "Run the existing test suite.",
            "Review impacted files and add regression tests if needed.",
        ],
        "review_checklist": [
            "Check code readability.",
            "Verify that modified files match the PR intent.",
            "Confirm that tests cover the changed behavior.",
        ],
        "impact_level": impact_level,
    }