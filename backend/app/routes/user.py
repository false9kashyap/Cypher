from fastapi import APIRouter, Depends

from bson import ObjectId


from app.database import database

from app.utils.dependencies import get_current_user




router = APIRouter(

    prefix="/user",

    tags=["User"]

)




users_collection = database["users"]







# ================= CURRENT USER =================


@router.get("/me")
async def get_me(

    user_id: str = Depends(get_current_user)

):


    user = await users_collection.find_one(

        {

            "_id": ObjectId(user_id)

        }

    )



    return {

        "id": str(user["_id"]),

        "username": user["username"],

        "email": user["email"]

    }









# ================= SEARCH USERS =================


@router.get("/search")
async def search_users(

    q: str,

    current_user: str = Depends(get_current_user)

):


    users=[]



    cursor = users_collection.find(

        {


            "username":{

                "$regex":q,

                "$options":"i"

            },


            "_id":{

                "$ne":ObjectId(current_user)

            }

        }

    )






    async for user in cursor:


        users.append(

            {

                "id":str(user["_id"]),

                "username":user["username"],

                "email":user["email"]

            }

        )





    return users