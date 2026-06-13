from pydantic_settings import BaseSettings


class Settings(BaseSettings):

    MONGO_URL: str
    DATABASE_NAME: str

    SECRET_KEY: str
    ALGORITHM: str


    class Config:
        env_file = ".env"


settings = Settings()