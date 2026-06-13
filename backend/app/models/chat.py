from datetime import datetime


def chat_model(users):

    return {
        "users": users,
        "created_at": datetime.utcnow()
    }