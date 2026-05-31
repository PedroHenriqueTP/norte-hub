from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        case_sensitive=True,
        env_file=".env",
        extra="ignore"
    )
    PROJECT_NAME: str = "Medical CRM"
    API_V1_STR: str = "/api/v1"
    
    # Postgres
    POSTGRES_SERVER: str = "localhost"
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "postgres"
    POSTGRES_DB: str = "crm_med"
    POSTGRES_PORT: str = "5432"
    DATABASE_URL: Optional[str] = None

    @property
    def assemble_db_url(self) -> str:
        if self.DATABASE_URL:
            return self.DATABASE_URL
        return f"postgresql+asyncpg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_SERVER}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"



    # Security
    SECRET_KEY: str = "YOUR_SUPER_SECRET_KEY_HERE"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    BACKEND_CORS_ORIGINS: list[str] = ["*"]
    GOOGLE_API_KEY: Optional[str] = None

    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"

    # Meta WhatsApp API
    META_ACCESS_TOKEN: Optional[str] = None
    META_PHONE_NUMBER_ID: Optional[str] = None
    META_VERIFY_TOKEN: str = "medcura_secret"

settings = Settings()
