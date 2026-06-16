from pydantic_settings import BaseSettings, SettingsConfigDict



class Settings(BaseSettings):


    MONGO_URL: str

    DATABASE_NAME: str


    SECRET_KEY: str

    ALGORITHM: str



    model_config = SettingsConfigDict(

        env_file=".env"

    )




settings = Settings()