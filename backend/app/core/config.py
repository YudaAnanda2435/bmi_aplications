from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "DietCare API"
    app_env: str = "development"
    database_url: str = "mysql+pymysql://root:@localhost:3306/sinagar_dietcare"
    secret_key: str = "change-this-secret-key"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 1440
    model_path: str = "ml_models/naive_bayes_obesity_model_final.pkl"
    model_metadata_path: str = "ml_models/model_metadata_final.json"
    default_admin_name: str = "Administrator"
    default_admin_email: str = "admin@sinagar.local"
    default_admin_password: str | None = None
    backend_cors_origins: str = Field(
        default="http://localhost:5173,http://localhost:3000"
    )

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    @property
    def cors_origins(self) -> list[str]:
        return [
            origin.strip()
            for origin in self.backend_cors_origins.split(",")
            if origin.strip()
        ]


@lru_cache
def get_settings() -> Settings:
    return Settings()
