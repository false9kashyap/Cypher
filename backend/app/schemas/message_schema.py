from pydantic import BaseModel


class MessageCreate(BaseModel):
    text: str