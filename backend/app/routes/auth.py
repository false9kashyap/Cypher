from fastapi import APIRouter, HTTPException

import re


from app.database import database

from app.schemas.user_schema import UserCreate, UserLogin


from app.utils.security import (
    hash_password,
    verify_password
)


from app.utils.jwt import create_token








router = APIRouter(

    prefix="/auth",

    tags=["Authentication"]

)





users_collection = database["users"]












# ================= REGISTER =================


@router.post("/register")
async def register(user:UserCreate):




    # CHECK EMAIL EXISTS


    existing_email = await users_collection.find_one(

        {
            "email":user.email
        }

    )






    if existing_email:


        raise HTTPException(

            status_code=400,

            detail="Email already exists"

        )










    # CHECK USERNAME EXISTS (CASE INSENSITIVE)


    existing_username = await users_collection.find_one(

        {

            "username":{

                "$regex":"^" + re.escape(user.username) + "$",

                "$options":"i"

            }

        }

    )








    if existing_username:


        raise HTTPException(

            status_code=400,

            detail="Username already taken"

        )











    new_user={



        "username":user.username,


        "email":user.email,


        "password":hash_password(

            user.password

        )


    }










    await users_collection.insert_one(

        new_user

    )









    return {

        "message":"User created successfully"

    }














# ================= LOGIN =================


@router.post("/login")
async def login(user:UserLogin):





    db_user = await users_collection.find_one(

        {
            "email":user.email
        }

    )









    if not db_user:


        raise HTTPException(

            status_code=404,

            detail="User not found"

        )











    if not verify_password(

        user.password,

        db_user["password"]

    ):


        raise HTTPException(

            status_code=401,

            detail="Wrong password"

        )













    token=create_token(

        {

            "sub":str(

                db_user["_id"]

            )

        }

    )











    return {

        "access_token":token,

        "token_type":"bearer"

    }













# ================= LOGOUT =================


@router.post("/logout")
async def logout():



    return {

        "message":"Logged out successfully"

    }