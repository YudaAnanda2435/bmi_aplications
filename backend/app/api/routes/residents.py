from typing import Annotated, Any

from fastapi import APIRouter, Depends, File, HTTPException, Query, UploadFile, status
from fastapi.responses import StreamingResponse
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.security import get_current_user
from app.db.session import get_db
from app.models.resident import Resident
from app.models.user import User
from app.schemas.resident import ResidentCreate, ResidentResponse, ResidentUpdate
from app.services.import_service import (
    create_import_template,
    import_and_classify_residents,
    parse_and_validate_excel,
)
from app.services.ml_service import get_ml_service
from app.utils.measurement import calculate_bmi, normalize_height_to_meter

router = APIRouter(prefix="/residents", tags=["Residents"])


def serialize_resident(resident: Resident) -> dict[str, Any]:
    return ResidentResponse.model_validate(resident).model_dump(mode="json")


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


@router.get("")
def list_residents(
    skip: Annotated[int, Query(ge=0)] = 0,
    limit: Annotated[int, Query(ge=1, le=500)] = 100,
    db: Session = Depends(get_db),
) -> dict[str, Any]:
    residents = db.scalars(
        select(Resident)
        .order_by(Resident.created_at.desc(), Resident.id.desc())
        .offset(skip)
        .limit(limit)
    ).all()

    return {
        "success": True,
        "message": "Residents retrieved successfully",
        "data": [serialize_resident(resident) for resident in residents],
    }


@router.get("/import-template")
def download_import_template(
    current_user: User = Depends(get_current_user),
) -> StreamingResponse:
    template = create_import_template()
    headers = {
        "Content-Disposition": "attachment; filename=resident_import_template.xlsx",
    }
    return StreamingResponse(
        template,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers=headers,
    )


@router.post("/import-preview")
async def preview_import(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
) -> dict[str, Any]:
    file_bytes = await file.read()
    validation_result = parse_and_validate_excel(file_bytes)

    return {
        "success": True,
        "message": "Import preview generated successfully",
        "data": {
            "total_rows": validation_result["total_rows"],
            "valid_count": validation_result["valid_count"],
            "error_count": validation_result["error_count"],
            "preview_valid_data": validation_result["preview_valid_data"],
            "errors": validation_result["errors"],
        },
    }


@router.post("/import-classify")
async def import_and_classify(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict[str, Any]:
    file_bytes = await file.read()
    import_result = import_and_classify_residents(
        db=db,
        file_bytes=file_bytes,
        created_by=current_user.id,
        ml_service=get_ml_service(),
    )

    return {
        "success": True,
        "message": "Residents imported and classified successfully",
        "data": import_result,
    }


@router.post("", status_code=status.HTTP_201_CREATED)
def create_resident(
    payload: ResidentCreate,
    db: Session = Depends(get_db),
) -> dict[str, Any]:
    resident_data = payload.model_dump()
    resident_data["height"] = normalize_height_to_meter(resident_data["height"])
    resident_data["bmi"] = round(calculate_bmi(
        height=resident_data["height"],
        weight=resident_data["weight"],
    ), 2)

    resident = Resident(**resident_data)
    db.add(resident)
    db.commit()
    db.refresh(resident)

    return {
        "success": True,
        "message": "Resident created successfully",
        "data": serialize_resident(resident),
    }


@router.get("/{resident_id}")
def get_resident(
    resident_id: int,
    db: Session = Depends(get_db),
) -> dict[str, Any]:
    resident = get_resident_or_404(db, resident_id)
    return {
        "success": True,
        "message": "Resident retrieved successfully",
        "data": serialize_resident(resident),
    }


@router.put("/{resident_id}")
def update_resident(
    resident_id: int,
    payload: ResidentUpdate,
    db: Session = Depends(get_db),
) -> dict[str, Any]:
    resident = get_resident_or_404(db, resident_id)
    update_data = payload.model_dump(exclude_unset=True)

    if "height" in update_data:
        update_data["height"] = normalize_height_to_meter(update_data["height"])

    for field, value in update_data.items():
        setattr(resident, field, value)

    if "height" in update_data or "weight" in update_data:
        resident.height = normalize_height_to_meter(resident.height)
        resident.bmi = round(calculate_bmi(height=resident.height, weight=resident.weight), 2)

    db.commit()
    db.refresh(resident)

    return {
        "success": True,
        "message": "Resident updated successfully",
        "data": serialize_resident(resident),
    }


@router.delete("/{resident_id}")
def delete_resident(
    resident_id: int,
    db: Session = Depends(get_db),
) -> dict[str, Any]:
    resident = get_resident_or_404(db, resident_id)
    db.delete(resident)
    db.commit()

    return {
        "success": True,
        "message": "Resident deleted successfully",
        "data": {"id": resident_id},
    }
