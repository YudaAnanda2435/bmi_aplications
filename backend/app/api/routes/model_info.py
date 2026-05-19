from fastapi import APIRouter

from app.services.ml_service import get_ml_service

router = APIRouter(prefix="/model", tags=["Model Info"])


@router.get("/info")
def get_model_info() -> dict[str, object]:
    ml_service = get_ml_service()
    return {
        "success": True,
        "message": "Model information retrieved successfully",
        "data": ml_service.get_model_info(),
    }
