from datetime import datetime


def message_model(
    chat_id,
    sender_id,
    text
):

    return {

        "chat_id": chat_id,

        "sender_id": sender_id,

        "text": text,

        "seen": False,

        "created_at": datetime.utcnow()
    }