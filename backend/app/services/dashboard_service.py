from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.classification import ClassificationResult
from app.models.resident import Resident


CLASS_LABELS = ["Underweight", "Normal", "Overweight", "Obesity"]


def get_dashboard_summary(db: Session) -> dict[str, object]:
    total_residents = db.scalar(select(func.count(Resident.id))) or 0
    total_classifications = db.scalar(select(func.count(ClassificationResult.id))) or 0

    distribution = {label: 0 for label in CLASS_LABELS}
    rows = db.execute(
        select(
            ClassificationResult.predicted_class,
            func.count(ClassificationResult.id),
        ).group_by(ClassificationResult.predicted_class)
    ).all()

    for predicted_class, total in rows:
        distribution[str(predicted_class)] = int(total)

    return {
        "total_residents": int(total_residents),
        "total_classifications": int(total_classifications),
        "class_distribution": distribution,
    }
