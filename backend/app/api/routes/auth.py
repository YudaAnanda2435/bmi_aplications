from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.core.security import authenticate_user, create_access_token
from app.db.session import get_db
from app.schemas.auth import LoginRequest, LoginResponse, TokenResponse, UserResponse

router = APIRouter(prefix="/auth", tags=["Auth"])


def create_invalid_login_exception() -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail={
            "success": False,
            "message": "Invalid email or password",
            "detail": None,
        },
        headers={"WWW-Authenticate": "Bearer"},
    )


@router.post("/login")
def login(
    payload: LoginRequest,
    db: Session = Depends(get_db),
) -> dict[str, object]:
    user = authenticate_user(db, payload.email, payload.password)
    if user is None:
        raise create_invalid_login_exception()

    token = create_access_token(subject=str(user.id))
    data = LoginResponse(
        access_token=token,
        user=UserResponse(id=user.id, name=user.name, email=user.email),
    )

    return {
        "success": True,
        "message": "Login successful",
        "data": data.model_dump(),
    }


@router.post("/token", response_model=TokenResponse)
def token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
) -> TokenResponse:
    user = authenticate_user(db, form_data.username, form_data.password)
    if user is None:
        raise create_invalid_login_exception()

    return TokenResponse(access_token=create_access_token(subject=str(user.id)))
