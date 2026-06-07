from datetime import datetime

from sqlalchemy import DateTime
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import Text
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column

from app.db.session import Base


class Analysis(Base):
    """
    Database model for storing Pull Request analysis results.
    """

    __tablename__ = "analyses"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    pr_url: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    repository: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    pr_number: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    pr_title: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    pr_author: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    summary: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    main_changes: Mapped[list] = mapped_column(
        JSONB,
        nullable=False,
    )

    risks: Mapped[list] = mapped_column(
        JSONB,
        nullable=False,
    )

    suggested_tests: Mapped[list] = mapped_column(
        JSONB,
        nullable=False,
    )

    review_checklist: Mapped[list] = mapped_column(
        JSONB,
        nullable=False,
    )

    changed_files: Mapped[list] = mapped_column(
        JSONB,
        nullable=False,
    )

    impact_level: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )

    files_changed: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    additions: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    deletions: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    commits: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )