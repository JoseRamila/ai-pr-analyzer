from sqlalchemy.orm import Session

from app.models.analysis import Analysis


class AnalysisRepository:
    """
    Repository responsible for database operations
    related to Pull Request analyses.
    """

    @staticmethod
    def create(
        db: Session,
        analysis: Analysis,
    ) -> Analysis:
        """
        Persist a new analysis in the database.
        """

        db.add(analysis)

        db.commit()

        db.refresh(analysis)

        return analysis
    
    @staticmethod
    def get_all(
        db: Session) -> list[Analysis]:
        """
        Retrieve all stored analyses.
        """
        return (
            db.query(Analysis)
            .order_by(Analysis.created_at.desc())
            .all()
        )
    