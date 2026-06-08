from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.security import (
    authenticate_user,
    create_access_token,
    get_current_user,
    get_password_hash,
)
from app.db.session import get_db
from app.models.user import User
from app.schemas.auth import (
    LoginRequest,
    LoginResponse,
    RegisterRequest,
    TokenResponse,
    UserResponse,
)

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


def serialize_user(user: User) -> UserResponse:
    return UserResponse(
        id=user.id,
        name=user.name,
        email=user.email,
        created_at=user.created_at,
    )


@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(
    payload: RegisterRequest,
    db: Session = Depends(get_db),
) -> dict[str, object]:
    existing_user = db.scalar(select(User).where(User.email == payload.email))
    if existing_user is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail={
                "success": False,
                "message": "Email already registered",
                "detail": {"email": payload.email},
            },
        )

    user = User(
        name=payload.name,
        email=payload.email,
        password_hash=get_password_hash(payload.password),
        is_active=True,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token(subject=str(user.id))
    data = LoginResponse(
        access_token=token,
        user=serialize_user(user),
    )

    return {
        "success": True,
        "message": "User registered successfully",
        "data": data.model_dump(),
    }


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
        user=serialize_user(user),
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
    user = authenticate_user(db, form_data.username.strip().lower(), form_data.password)
    if user is None:
        raise create_invalid_login_exception()

    return TokenResponse(access_token=create_access_token(subject=str(user.id)))


@router.get("/me")
def get_me(current_user: User = Depends(get_current_user)) -> dict[str, object]:
    return {
        "success": True,
        "message": "Current user retrieved successfully",
        "data": serialize_user(current_user).model_dump(mode="json"),
    }
