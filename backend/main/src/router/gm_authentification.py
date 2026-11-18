import os
import secrets
from pydantic import BaseModel, EmailStr
from fastapi import APIRouter, HTTPException
from src.authentification.db import auth_client, supabase

router = APIRouter()


class UserAuth(BaseModel):
    email: EmailStr
    password: str


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    signup_code: str


@router.post("/api/register")
def register(body: RegisterRequest):
    if not secrets.compare_digest(body.signup_code, os.getenv("GM_SIGNUP_CODE", "")):
        raise HTTPException(status_code=403, detail="Invalid sign-up code")

    try:
        auth_user = supabase.auth.admin.create_user(
            {"email": body.email, "password": body.password, "email_confirm": True}
        ).user
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    try:
        supabase.table("app_users").insert({
            "auth_id": auth_user.id,
            "email": body.email,
        }).execute()
    except Exception as e:
        supabase.auth.admin.delete_user(auth_user.id)
        raise HTTPException(status_code=500, detail=f"Could not create app user: {e}")

    return {"message": "GM account created", "user_id": auth_user.id}


@router.post("/api/login")
def login(user: UserAuth):
    try:
        response = auth_client.auth.sign_in_with_password(
            {"email": user.email, "password": user.password}
        )
        return {
            "message": "Login successfully!",
            "access_token": response.session.access_token,
            "user": response.user.email,
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
