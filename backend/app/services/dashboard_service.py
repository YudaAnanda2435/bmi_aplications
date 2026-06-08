from sqlalchemy import func, select
from sqlalchemy.orm import Session, joinedload

from app.models.classification import ClassificationResult
from app.models.resident import Resident


CLASS_LABELS = ["Underweight", "Normal", "Overweight", "Obesity"]


def serialize_recent_classification(result: ClassificationResult) -> dict[str, object]:
    resident = result.resident

    return {
        "id": result.id,
        "classification_id": result.id,
        "resident_id": result.resident_id,
        "resident_name": resident.name if resident else None,
        "predicted_class": result.predicted_class,
        "early_warning": result.early_warning,
        "bmi": resident.bmi if resident else None,
        "created_at": result.created_at.isoformat() if result.created_at else None,
    }


def get_dashboard_summary(db: Session, user_id: int) -> dict[str, object]:
    total_residents = (
        db.scalar(
            select(func.count(Resident.id)).where(Resident.user_id == user_id)
        )
        or 0
    )
    total_classifications = (
        db.scalar(
            select(func.count(ClassificationResult.id)).where(
                ClassificationResult.user_id == user_id
            )
        )
        or 0
    )

    distribution = {label: 0 for label in CLASS_LABELS}
    rows = db.execute(
        select(
            ClassificationResult.predicted_class,
            func.count(ClassificationResult.id),
        )
        .where(ClassificationResult.user_id == user_id)
        .group_by(ClassificationResult.predicted_class)
    ).all()

    for predicted_class, total in rows:
        distribution[str(predicted_class)] = int(total)

    recent_classifications = db.scalars(
        select(ClassificationResult)
        .options(joinedload(ClassificationResult.resident))
        .where(ClassificationResult.user_id == user_id)
        .order_by(ClassificationResult.created_at.desc(), ClassificationResult.id.desc())
        .limit(5)
    ).all()

    return {
        "total_residents": int(total_residents),
        "total_classifications": int(total_classifications),
        "class_distribution": distribution,
        "recent_reports": [
            serialize_recent_classification(result)
            for result in recent_classifications
        ],
    }
