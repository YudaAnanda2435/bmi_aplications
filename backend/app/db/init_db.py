from sqlalchemy import inspect, select, text
from app.core.config import get_settings
from app.core.security import get_password_hash
from app.db.base import Base
from app.db.session import SessionLocal, engine
from app.models import classification, resident, user  # noqa: F401
from app.models.user import User


def init_db() -> None:
    Base.metadata.create_all(bind=engine)
    ensure_user_owned_columns()
    create_default_user()
    backfill_legacy_ownership()


def ensure_user_owned_columns() -> None:
    inspector = inspect(engine)
    existing_tables = set(inspector.get_table_names())

    with engine.begin() as connection:
        if "users" in existing_tables:
            user_columns = {
                column["name"]
                for column in inspector.get_columns("users")
            }
            if "is_active" not in user_columns:
                connection.execute(
                    text(
                        "ALTER TABLE users "
                        "ADD COLUMN is_active TINYINT(1) NOT NULL DEFAULT 1"
                    )
                )

        if "residents" in existing_tables:
            resident_columns = {
                column["name"]
                for column in inspector.get_columns("residents")
            }
            resident_indexes = {
                index["name"]
                for index in inspector.get_indexes("residents")
            }
            if "user_id" not in resident_columns:
                connection.execute(text("ALTER TABLE residents ADD COLUMN user_id INT NULL"))
            if "ix_residents_user_id" not in resident_indexes:
                connection.execute(
                    text("CREATE INDEX ix_residents_user_id ON residents (user_id)")
                )

        if "classification_results" in existing_tables:
            classification_columns = {
                column["name"]
                for column in inspector.get_columns("classification_results")
            }
            classification_indexes = {
                index["name"]
                for index in inspector.get_indexes("classification_results")
            }
            if "user_id" not in classification_columns:
                connection.execute(
                    text("ALTER TABLE classification_results ADD COLUMN user_id INT NULL")
                )
            if "ix_classification_results_user_id" not in classification_indexes:
                connection.execute(
                    text(
                        "CREATE INDEX ix_classification_results_user_id "
                        "ON classification_results (user_id)"
                    )
                )


def create_default_user() -> None:
    settings = get_settings()
    if settings.app_env != "development" or not settings.development_user_password:
        return

    with SessionLocal() as db:
        existing_user = db.scalar(
            select(User).where(User.email == settings.development_user_email)
        )
        if existing_user is not None:
            return

        user = User(
            name=settings.development_user_name,
            email=settings.development_user_email,
            password_hash=get_password_hash(settings.development_user_password),
            is_active=True,
        )
        db.add(user)
        db.commit()


def backfill_legacy_ownership() -> None:
    with engine.begin() as connection:
        connection.execute(
            text(
                "UPDATE residents "
                "SET user_id = COALESCE(created_by, (SELECT id FROM users ORDER BY id LIMIT 1)) "
                "WHERE user_id IS NULL"
            )
        )
        connection.execute(
            text(
                "UPDATE classification_results cr "
                "JOIN residents r ON r.id = cr.resident_id "
                "SET cr.user_id = r.user_id "
                "WHERE cr.user_id IS NULL"
            )
        )
