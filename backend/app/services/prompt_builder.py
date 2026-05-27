def build_pull_request_prompt(
    repository: str,
    pr_title: str,
    pr_author: str,
    changed_files: list[str],
) -> str:
    """
    Build a structured AI prompt for Pull Request analysis.

    This transforms GitHub data into a format that can later
    be consumed by an LLM such as OpenAI GPT models.
    """

    files_section = "\n\n".join(changed_files)

    prompt = f"""
You are a senior software engineer performing a professional code review.

Analyze the following GitHub Pull Request.

Repository:
{repository}

Pull Request Title:
{pr_title}

Author:
{pr_author}

Changed Files:
{files_section}

Provide:
1. A concise summary
2. Main risks
3. Suggested tests
4. Review checklist
5. Estimated impact level
"""

    return prompt.strip()