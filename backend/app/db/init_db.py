from sqlalchemy import select
from app.core.config import get_settings
from app.core.security import get_password_hash
from app.db.base import Base
from app.db.session import SessionLocal, engine
from app.models import classification, resident, user  # noqa: F401
from app.models.user import User


def init_db() -> None:
    Base.metadata.create_all(bind=engine)
    create_default_admin()


def create_default_admin() -> None:
    settings = get_settings()
    if settings.app_env != "development" or not settings.default_admin_password:
        return

    with SessionLocal() as db:
        existing_admin = db.scalar(
            select(User).where(User.email == settings.default_admin_email)
        )
        if existing_admin is not None:
            return

        admin = User(
            name=settings.default_admin_name,
            email=settings.default_admin_email,
            password_hash=get_password_hash(settings.default_admin_password),
        )
        db.add(admin)
        db.commit()
