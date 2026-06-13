from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from datetime import datetime

from bson import ObjectId

from app.database import database





router = APIRouter(

    prefix="/ws",

    tags=["WebSocket"]

)









class ConnectionManager:


    def __init__(self):


        self.active_connections = {}









    async def connect(

        self,

        chat_id,

        websocket

    ):



        await websocket.accept()







        if chat_id not in self.active_connections:


            self.active_connections[chat_id]=[]








        self.active_connections[chat_id].append(

            websocket

        )












    def disconnect(

        self,

        chat_id,

        websocket

    ):



        if websocket in self.active_connections.get(

            chat_id,

            []

        ):


            self.active_connections[chat_id].remove(

                websocket

            )













    async def broadcast(

        self,

        chat_id,

        message

    ):



        disconnected=[]








        for connection in self.active_connections.get(

            chat_id,

            []

        ):



            try:


                await connection.send_json(

                    message

                )



            except:


                disconnected.append(

                    connection

                )











        for connection in disconnected:


            self.disconnect(

                chat_id,

                connection

            )












manager = ConnectionManager()














@router.websocket("/{chat_id}/{user_id}")
async def websocket_endpoint(

    websocket:WebSocket,

    chat_id:str,

    user_id:str

):






    await manager.connect(

        chat_id,

        websocket

    )











    try:



        while True:




            data = await websocket.receive_json()













            # ================= READ SINGLE MESSAGE =================


            if data.get("type")=="read":




                await database.messages.update_one(

                    {

                        "_id":ObjectId(

                            data["message_id"]

                        )

                    },


                    {

                        "$addToSet":{

                            "readBy":user_id

                        }

                    }

                )











                await manager.broadcast(

                    chat_id,

                    {

                        "type":"read",

                        "message_id":data["message_id"],

                        "reader":user_id

                    }

                )




                continue















            # ================= READ WHOLE CHAT =================



            if data.get("type")=="read_chat":




                await database.messages.update_many(

                    {


                        "chat_id":chat_id,


                        "sender":{

                            "$ne":user_id

                        }

                    },


                    {

                        "$addToSet":{

                            "readBy":user_id

                        }

                    }

                )









                await manager.broadcast(

                    chat_id,

                    {

                        "type":"read_chat",

                        "reader":user_id

                    }

                )



                continue

















            # ================= TYPING =================


            if data.get("type")=="typing":





                await manager.broadcast(

                    chat_id,

                    {

                        "type":"typing",

                        "sender":user_id,

                        "isTyping":data.get(

                            "isTyping",

                            False

                        )

                    }

                )





                continue
















            # ================= MESSAGE =================



            if data.get("type")=="message":





                now=datetime.utcnow()







                new_message={


                    "chat_id":chat_id,


                    "sender":user_id,


                    "text":data["text"],


                    "readBy":[

                        user_id

                    ],


                    "createdAt":now


                }











                result = await database.messages.insert_one(

                    new_message

                )











                await manager.broadcast(

                    chat_id,

                    {


                        "type":"message",


                        "id":str(

                            result.inserted_id

                        ),


                        "_id":str(

                            result.inserted_id

                        ),


                        "chat_id":chat_id,


                        "sender":user_id,


                        "text":data["text"],


                        "readBy":[

                            user_id

                        ],


                        "createdAt":now.isoformat()


                    }

                )














    except WebSocketDisconnect:




        manager.disconnect(

            chat_id,

            websocket

        )