from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    database_url: str = "sqlite+aiosqlite:///./opportunity_radar.db"
    secret_key: str = "super_secret_temporary_key_for_et_hackathon_12345"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 1440 # 24 hours

    class Config:
        env_file = ".env"

settings = Settings()
