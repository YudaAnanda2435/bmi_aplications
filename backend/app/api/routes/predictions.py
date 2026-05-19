from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.classification import ClassificationResult
from app.models.resident import Resident
from app.schemas.classification import PredictionInput
from app.services.ml_service import get_ml_service
from app.utils.measurement import normalize_height_to_meter

router = APIRouter(prefix="/predictions", tags=["Predictions"])


def map_resident_to_model_features(resident: Resident) -> dict[str, Any]:
    return {
        "Gender": resident.gender,
        "Age": resident.age,
        "Height": normalize_height_to_meter(resident.height),
        "Weight": resident.weight,
        "family_history_with_overweight": resident.family_history_with_overweight,
        "FAVC": resident.favc,
        "FCVC": resident.fcvc,
        "NCP": resident.ncp,
        "CAEC": resident.caec,
        "SMOKE": resident.smoke,
        "CH2O": resident.ch2o,
        "SCC": resident.scc,
        "FAF": resident.faf,
        "TUE": resident.tue,
        "CALC": resident.calc,
        "MTRANS": resident.mtrans,
    }


def get_resident_or_404(db: Session, resident_id: int) -> Resident:
    resident = db.get(Resident, resident_id)
    if resident is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={
                "success": False,
                "message": "Resident not found",
                "detail": {"resident_id": resident_id},
            },
        )
    return resident


@router.post("/predict")
def predict_obesity_status(payload: PredictionInput) -> dict[str, object]:
    ml_service = get_ml_service()

    try:
        prediction = ml_service.predict(payload.model_dump())
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail={
                "success": False,
                "message": "Prediction service unavailable",
                "detail": str(exc),
            },
        ) from exc

    return {
        "success": True,
        "message": "Prediction created successfully",
        "data": prediction,
    }


@router.post("/residents/{resident_id}")
def predict_stored_resident(
    resident_id: int,
    db: Session = Depends(get_db),
) -> dict[str, object]:
    resident = get_resident_or_404(db, resident_id)
    ml_service = get_ml_service()

    try:
        prediction = ml_service.predict(map_resident_to_model_features(resident))
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail={
                "success": False,
                "message": "Prediction service unavailable",
                "detail": str(exc),
            },
        ) from exc

    probabilities = prediction["probabilities"]
    classification_result = ClassificationResult(
        resident_id=resident.id,
        predicted_class=prediction["predicted_class"],
        probability_underweight=probabilities.get("Underweight"),
        probability_normal=probabilities.get("Normal"),
        probability_overweight=probabilities.get("Overweight"),
        probability_obesity=probabilities.get("Obesity"),
        recommendation=prediction["recommendation"],
        early_warning=prediction["early_warning"],
        note=prediction["note"],
    )

    db.add(classification_result)
    db.commit()
    db.refresh(classification_result)

    return {
        "success": True,
        "message": "Resident prediction created successfully",
        "data": {
            "classification_id": classification_result.id,
            "resident_id": resident.id,
            "predicted_class": prediction["predicted_class"],
            "bmi": prediction["bmi"],
            "probabilities": probabilities,
            "recommendation": prediction["recommendation"],
            "early_warning": prediction["early_warning"],
            "note": prediction["note"],
            "diet_pattern": prediction["diet_pattern"],
            "recommendation_summary": prediction["recommendation_summary"],
            "main_recommendations": prediction["main_recommendations"],
            "meal_schedule": prediction["meal_schedule"],
            "additional_notes": prediction["additional_notes"],
            "method": prediction["method"],
            "source_basis": prediction["source_basis"],
            "source_references": prediction["source_references"],
        },
    }
