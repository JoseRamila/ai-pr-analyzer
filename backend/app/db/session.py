from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker

from app.core.settings import settings


# Creates the SQLAlchemy engine using the DATABASE_URL.
engine = create_engine(
    settings.database_url,
    echo=True,
)


# Creates database sessions.
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)


# Base class for all database models.
Base = declarative_base()


def get_db():
    """
    Dependency used to get a database session.

    Automatically closes the session after the request finishes.
    """

    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()