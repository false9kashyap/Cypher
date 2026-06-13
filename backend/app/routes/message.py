from fastapi import APIRouter, Depends, HTTPException
from bson import ObjectId
from datetime import datetime


from app.database import database
from app.utils.dependencies import get_current_user
from app.schemas.message_schema import MessageCreate





router = APIRouter(

    prefix="/message",

    tags=["Message"]

)





messages_collection = database["messages"]

chats_collection = database["chats"]







# ==========================
# SEND MESSAGE (HTTP)
# ==========================


@router.post("/{chat_id}")
async def send_message(

    chat_id:str,

    message:MessageCreate,

    current_user=Depends(get_current_user)

):



    chat = await chats_collection.find_one(

        {

            "_id":ObjectId(chat_id)

        }

    )




    if not chat:


        raise HTTPException(

            status_code=404,

            detail="Chat not found"

        )






    now = datetime.utcnow()






    new_message={


        "chat_id":chat_id,


        "sender":current_user,


        "text":message.text,


        "readBy":[

            current_user

        ],


        "createdAt":now

    }







    result = await messages_collection.insert_one(

        new_message

    )








    return {


        "id":str(result.inserted_id),


        "_id":str(result.inserted_id),


        "chat_id":chat_id,


        "sender":current_user,


        "text":message.text,


        "readBy":new_message["readBy"],


        "createdAt":now.isoformat()

    }









# ==========================
# GET CHAT MESSAGES
# ==========================



@router.get("/{chat_id}")
async def get_messages(

    chat_id:str,

    current_user=Depends(get_current_user)

):



    messages=[]





    cursor = messages_collection.find(

        {

            "chat_id":chat_id

        }

    ).sort(

        "createdAt",

        1

    )







    async for msg in cursor:




        created = msg.get(

            "createdAt"

        )





        messages.append(


            {


                "id":str(msg["_id"]),


                "_id":str(msg["_id"]),


                "chat_id":msg["chat_id"],


                "sender":msg["sender"],


                "text":msg["text"],


                "readBy":msg.get(

                    "readBy",

                    []

                ),



                "createdAt": (

                    created.isoformat()

                    if created

                    else

                    ""

                )


            }


        )





    return messages











# ==========================
# MARK CHAT READ
# ==========================



@router.put("/read/{chat_id}")
async def mark_as_read(

    chat_id:str,

    current_user=Depends(get_current_user)

):



    await messages_collection.update_many(


        {


            "chat_id":chat_id,


            "sender":{


                "$ne":current_user

            }


        },



        {


            "$addToSet":{


                "readBy":current_user

            }


        }


    )






    return {


        "status":"Messages read",


        "reader":current_user


    }