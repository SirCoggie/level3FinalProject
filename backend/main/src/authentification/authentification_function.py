from fastapi import HTTPException, Depends
from uuid import UUID
from src.authentification.db import supabase
from src.authentification.defense import get_current_user


def get_app_user(current_user=Depends(get_current_user)):
    result = supabase.table("app_users").select("id,email").eq("auth_id", current_user.id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="user not found in app_users")
    return result.data[0]


def require_real_gm_account(current_user=Depends(get_app_user)):
    if current_user["email"].endswith("@seats.invalid"):
        raise HTTPException(status_code=403, detail="Only GM accounts can do this")
    return current_user


def get_membership(campaign_id: UUID, user_id: str):
    m = (
        supabase.table("campaign_members")
        .select("id,role,status,can_roll_dice")
        .eq("campaign_id", str(campaign_id))
        .eq("user_id", user_id)
        .execute()
    )
    if not m.data:
        raise HTTPException(status_code=404, detail="The world/user is not found!!")
    return m.data[0]


def require_gm(campaign_id: UUID, current_user=Depends(get_app_user)):
    member = get_membership(campaign_id, current_user["id"])
    if member["role"] != "gm":
        raise HTTPException(status_code=403, detail="Not the GM!")
    return current_user
