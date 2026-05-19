from fastapi import APIRouter

from app.core.config import get_settings

router = APIRouter(tags=["Health"])


@router.get("/health")
def health_check() -> dict[str, object]:
    settings = get_settings()
    return {
        "success": True,
        "message": "Sinagar DietCare API is running",
        "data": {
            "app_name": settings.app_name,
            "environment": settings.app_env,
        },
    }
