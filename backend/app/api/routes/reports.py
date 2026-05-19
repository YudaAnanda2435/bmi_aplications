from typing import Annotated, Any

from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from sqlalchemy import and_, or_, select
from sqlalchemy.orm import Session, aliased, joinedload

from app.db.session import get_db
from app.models.classification import ClassificationResult
from app.models.resident import Resident
from app.services.report_pdf_service import build_report_pdf
from app.services.recommendation_service import get_recommendation_plan

router = APIRouter(prefix="/reports", tags=["Reports"])


def serialize_resident(resident: Resident) -> dict[str, Any]:
    return {
        "id": resident.id,
        "created_by": resident.created_by,
        "name": resident.name,
        "gender": resident.gender,
        "age": resident.age,
        "height": resident.height,
        "weight": resident.weight,
        "bmi": resident.bmi,
        "family_history_with_overweight": resident.family_history_with_overweight,
        "favc": resident.favc,
        "fcvc": resident.fcvc,
        "ncp": resident.ncp,
        "caec": resident.caec,
        "smoke": resident.smoke,
        "ch2o": resident.ch2o,
        "scc": resident.scc,
        "faf": resident.faf,
        "tue": resident.tue,
        "calc": resident.calc,
        "mtrans": resident.mtrans,
        "created_at": resident.created_at.isoformat() if resident.created_at else None,
        "updated_at": resident.updated_at.isoformat() if resident.updated_at else None,
    }


def serialize_classification(result: ClassificationResult) -> dict[str, Any]:
    return {
        "id": result.id,
        "resident_id": result.resident_id,
        "predicted_class": result.predicted_class,
        "probabilities": {
            "Underweight": result.probability_underweight,
            "Normal": result.probability_normal,
            "Overweight": result.probability_overweight,
            "Obesity": result.probability_obesity,
        },
        "recommendation": result.recommendation,
        "early_warning": result.early_warning,
        "note": result.note,
        "created_at": result.created_at.isoformat() if result.created_at else None,
    }


def map_resident_to_recommendation_input(resident: Resident | None) -> dict[str, Any]:
    if resident is None:
        return {}

    return {
        "Gender": resident.gender,
        "Age": resident.age,
        "Height": resident.height,
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


def serialize_classification_detail(result: ClassificationResult) -> dict[str, Any]:
    classification = serialize_classification(result)
    resident = result.resident
    recommendation_plan = get_recommendation_plan(
        predicted_class=result.predicted_class,
        bmi=resident.bmi if resident else None,
        input_data=map_resident_to_recommendation_input(resident),
    )

    classification.update(
        {
            "diet_pattern": recommendation_plan["diet_pattern"],
            "goal": recommendation_plan["goal"],
            "recommendation_summary": recommendation_plan["recommendation_summary"],
            "main_recommendations": recommendation_plan["main_recommendations"],
            "meal_schedule": recommendation_plan["meal_schedule"],
            "additional_notes": recommendation_plan["additional_notes"],
            "method": recommendation_plan["method"],
            "source_basis": recommendation_plan["source_basis"],
            "source_references": recommendation_plan["source_references"],
        }
    )
    return classification


def serialize_report(result: ClassificationResult) -> dict[str, Any]:
    return {
        **serialize_classification(result),
        "resident": serialize_resident(result.resident),
    }


def serialize_report_row(result: ClassificationResult) -> dict[str, Any]:
    return {
        "classification_id": result.id,
        "resident_id": result.resident_id,
        "resident_name": result.resident.name if result.resident else None,
        "predicted_class": result.predicted_class,
        "early_warning": result.early_warning,
        "bmi": result.resident.bmi if result.resident else None,
        "recommendation": result.recommendation,
        "created_at": result.created_at.isoformat() if result.created_at else None,
    }


def get_classification_or_404(db: Session, classification_id: int) -> ClassificationResult:
    result = db.scalar(
        select(ClassificationResult)
        .options(joinedload(ClassificationResult.resident))
        .where(ClassificationResult.id == classification_id)
    )
    if result is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={
                "success": False,
                "message": "Classification report not found",
                "detail": {"classification_id": classification_id},
            },
        )
    return result


@router.get("/latest")
def list_latest_reports(
    skip: Annotated[int, Query(ge=0)] = 0,
    limit: Annotated[int, Query(ge=1, le=500)] = 100,
    db: Session = Depends(get_db),
) -> dict[str, Any]:
    newer_report = aliased(ClassificationResult)
    has_newer_report = (
        select(newer_report.id)
        .where(
            newer_report.resident_id == ClassificationResult.resident_id,
            or_(
                newer_report.created_at > ClassificationResult.created_at,
                and_(
                    newer_report.created_at == ClassificationResult.created_at,
                    newer_report.id > ClassificationResult.id,
                ),
            ),
        )
        .exists()
    )

    reports = db.scalars(
        select(ClassificationResult)
        .options(joinedload(ClassificationResult.resident))
        .where(~has_newer_report)
        .order_by(ClassificationResult.created_at.desc(), ClassificationResult.id.desc())
        .offset(skip)
        .limit(limit)
    ).all()

    return {
        "success": True,
        "message": "Latest reports retrieved successfully",
        "data": [serialize_report_row(report) for report in reports],
    }


@router.get("/history")
def list_report_history(
    skip: Annotated[int, Query(ge=0)] = 0,
    limit: Annotated[int, Query(ge=1, le=500)] = 100,
    db: Session = Depends(get_db),
) -> dict[str, Any]:
    reports = db.scalars(
        select(ClassificationResult)
        .options(joinedload(ClassificationResult.resident))
        .order_by(ClassificationResult.created_at.desc(), ClassificationResult.id.desc())
        .offset(skip)
        .limit(limit)
    ).all()

    return {
        "success": True,
        "message": "Classification history retrieved successfully",
        "data": [serialize_report_row(report) for report in reports],
    }


@router.get("")
def list_reports(
    skip: Annotated[int, Query(ge=0)] = 0,
    limit: Annotated[int, Query(ge=1, le=500)] = 100,
    db: Session = Depends(get_db),
) -> dict[str, Any]:
    reports = db.scalars(
        select(ClassificationResult)
        .options(joinedload(ClassificationResult.resident))
        .order_by(ClassificationResult.created_at.desc(), ClassificationResult.id.desc())
        .offset(skip)
        .limit(limit)
    ).all()

    return {
        "success": True,
        "message": "Reports retrieved successfully",
        "data": [serialize_report(report) for report in reports],
    }


@router.get("/{classification_id}/pdf")
def get_report_pdf(
    classification_id: int,
    db: Session = Depends(get_db),
) -> Response:
    report = get_classification_or_404(db, classification_id)
    pdf_bytes = build_report_pdf(
        {
            "classification": serialize_classification_detail(report),
            "resident": serialize_resident(report.resident),
        }
    )

    filename = f"laporan-klasifikasi-{classification_id}.pdf"
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )


@router.get("/{classification_id}")
def get_report_detail(
    classification_id: int,
    db: Session = Depends(get_db),
) -> dict[str, Any]:
    report = get_classification_or_404(db, classification_id)
    return {
        "success": True,
        "message": "Report detail retrieved successfully",
        "data": {
            "classification": serialize_classification_detail(report),
            "resident": serialize_resident(report.resident),
        },
    }
