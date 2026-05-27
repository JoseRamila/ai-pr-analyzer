def build_changed_files_summary(files: list[dict]) -> list[str]:
    """
    Build a human-readable summary of changed files.

    This function extracts only the most relevant file metadata
    from GitHub's Pull Request files response.
    """

    changed_files_summary = []

    for file in files:
        filename = file.get("filename", "unknown")

        status = file.get("status", "modified")

        additions = file.get("additions", 0)
        deletions = file.get("deletions", 0)

        patch = file.get("patch", "")

        # GitHub patch content can become extremely large
        # We truncate it temporarily to avoid massive response

        shortened_patch = patch[:300]

        file_summary = (
            f"{filename} ({status}) - "
            f"{additions} additions, "
            f"{deletions} deletions\n"
            f"Patch Preview:\n"
            f"{shortened_patch}"
        )

        changed_files_summary.append(file_summary)

    return changed_files_summary