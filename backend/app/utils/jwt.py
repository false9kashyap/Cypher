from jose import jwt
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv


load_dotenv()


SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")


def create_token(data: dict):

    payload = data.copy()

    expire = datetime.utcnow() + timedelta(days=7)

    payload.update(
        {
            "exp": expire
        }
    )

    token = jwt.encode(
        payload,
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return token