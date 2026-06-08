from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager
from typing import Any

from fastapi import Depends, FastAPI
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.api.routes.auth import router as auth_router
from app.api.routes.dashboard import router as dashboard_router
from app.api.routes.health import router as health_router
from app.api.routes.model_info import router as model_info_router
from app.api.routes.predictions import router as predictions_router
from app.api.routes.reports import router as reports_router
from app.api.routes.residents import router as residents_router
from app.core.config import get_settings
from app.core.security import get_current_user
from app.db.init_db import init_db
from app.utils.response import error_response


settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    init_db()
    yield


app = FastAPI(
    title=settings.app_name,
    description=(
        "Backend API untuk sistem rekomendasi pola diet dan peringatan dini "
        "berdasarkan klasifikasi status obesitas."
    ),
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def normalize_error_detail(detail: Any) -> tuple[str, Any]:
    if isinstance(detail, dict):
        message = str(detail.get("message") or "Request failed")
        data = detail.get("data", detail.get("detail"))
        return message, data
    return str(detail), None


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(
    request: object,
    exc: RequestValidationError,
) -> JSONResponse:
    return JSONResponse(
        status_code=422,
        content=error_response(
            message="Validation error",
            data={"errors": exc.errors()},
        ),
    )


@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(
    request: object,
    exc: StarletteHTTPException,
) -> JSONResponse:
    message, data = normalize_error_detail(exc.detail)
    return JSONResponse(
        status_code=exc.status_code,
        content=error_response(message=message, data=data),
        headers=getattr(exc, "headers", None),
    )


app.include_router(health_router, prefix="/api")
app.include_router(auth_router, prefix="/api")
app.include_router(model_info_router, prefix="/api", dependencies=[Depends(get_current_user)])
app.include_router(predictions_router, prefix="/api", dependencies=[Depends(get_current_user)])
app.include_router(residents_router, prefix="/api", dependencies=[Depends(get_current_user)])
app.include_router(dashboard_router, prefix="/api", dependencies=[Depends(get_current_user)])
app.include_router(reports_router, prefix="/api", dependencies=[Depends(get_current_user)])


@app.get("/")
def root() -> dict[str, object]:
    return {
        "success": True,
        "message": "Welcome to DietCare API",
        "data": {
            "docs_url": "/docs",
            "health_url": "/api/health",
        },
    }
