from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import database
from app.routes import auth, user, chat, message, ws


app = FastAPI(
    title="CYPHER API"
)


# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Routes
app.include_router(auth.router)
app.include_router(user.router)
app.include_router(chat.router)
app.include_router(message.router)
app.include_router(ws.router)



@app.get("/")
async def root():

    return {
        "status": "CYPHER ONLINE",
        "message": "secure channel initialized"
    }



@app.get("/db")
async def check_database():

    collections = await database.list_collection_names()

    return {
        "status": "DATABASE LINK ACTIVE",
        "collections": collections
    }