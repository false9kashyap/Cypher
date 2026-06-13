from fastapi import APIRouter, Depends, HTTPException

from bson import ObjectId


from app.database import database

from app.utils.dependencies import get_current_user

from app.models.chat import chat_model





router = APIRouter(

    prefix="/chat",

    tags=["Chat"]

)





chats_collection = database["chats"]

users_collection = database["users"]

messages_collection = database["messages"]







# =========================
# CREATE CHAT
# =========================


@router.post("/create/{receiver_id}")
async def create_chat(

    receiver_id:str,

    current_user:str = Depends(get_current_user)

):



    receiver = await users_collection.find_one(

        {
            "_id":ObjectId(receiver_id)
        }

    )





    if not receiver:


        raise HTTPException(

            status_code=404,

            detail="User not found"

        )










    existing_chat = await chats_collection.find_one(

        {

            "users":{

                "$all":[

                    current_user,

                    receiver_id

                ]

            }

        }

    )









    if existing_chat:


        return {

            "chat_id":str(existing_chat["_id"]),

            "message":"Chat already exists"

        }










    chat = chat_model(

        [

            current_user,

            receiver_id

        ]

    )








    result = await chats_collection.insert_one(

        chat

    )









    return {

        "chat_id":str(result.inserted_id),

        "message":"Chat created"

    }















# =========================
# GET MY CHATS
# =========================


@router.get("/")
async def my_chats(

    current_user:str = Depends(get_current_user)

):



    chats=[]









    cursor = chats_collection.find(

        {
            "users":current_user
        }

    )











    async for chat in cursor:






        other_user_id=None






        for uid in chat["users"]:



            if uid != current_user:


                other_user_id=uid












        other_user = await users_collection.find_one(

            {
                "_id":ObjectId(other_user_id)
            }

        )








        if not other_user:


            continue











        last_message = await messages_collection.find_one(

            {

                "chat_id":str(chat["_id"])

            },


            sort=[

                (

                    "createdAt",

                    -1

                )

            ]

        )










        preview=""

        last_time=None










        if last_message:


            preview = last_message.get(

                "text",

                ""

            )







            if last_message.get("createdAt"):



                last_time = (

                    last_message["createdAt"]

                    .isoformat()

                )












        unread_count = await messages_collection.count_documents(

            {


                "chat_id":str(chat["_id"]),



                "sender":{

                    "$ne":current_user

                },



                "readBy":{

                    "$nin":[current_user]

                }


            }

        )












        chats.append(

            {


                "id":str(chat["_id"]),



                "users":chat["users"],



                "lastMessage":preview,



                "lastMessageTime":last_time,



                "unreadCount":unread_count,









                "otherUser":{


                    "id":str(other_user["_id"]),



                    "username":other_user["username"]


                }


            }

        )










    return chats