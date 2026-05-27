from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Centralized application settings.

    This class loads configuration values from environment variables
    or from a local .env file. Keeping settings in one place prevents
    hardcoded secrets and makes the app easier to configure in different
    environments such as local development, Docker, and production.
    """

    app_name: str = "AI PR Analyzer"
    app_version: str = "1.0.0"

    openai_api_key: str

    github_token: str | None = None

    database_url: str | None = None

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore",
    )


settings = Settings()