from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from uuid import UUID
from typing import Optional, Literal
from src.authentification.db import supabase
from src.authentification.authentification_function import require_gm, get_app_user, get_membership

router = APIRouter()


@router.get("/campaigns/{campaign_id}/members")
def view_members(campaign_id: UUID, current_user=Depends(get_app_user)):
    get_membership(campaign_id, current_user["id"])
    result = (
        supabase.table("campaign_members")
        .select("id,user_id,role,status,can_roll_dice,joined_at,app_users(email)")
        .eq("campaign_id", str(campaign_id))
        .order("joined_at")
        .execute()
    )
    return {"data": result.data}


@router.delete("/campaigns/{campaign_id}/members/{member_id}")
def kick_player(campaign_id: UUID, member_id: UUID, current_user=Depends(require_gm)):
    response = (
        supabase.table("campaign_members")
        .select("role")
        .eq("campaign_id", str(campaign_id))
        .eq("id", str(member_id))
        .execute()
    )
    if not response.data:
        raise HTTPException(status_code=404, detail="kicking failed")
    if response.data[0]["role"] == "gm":
        raise HTTPException(status_code=400, detail="The GOD cannot be kicked!")

    supabase.table("campaign_members").delete().eq("campaign_id", str(campaign_id)).eq("id", str(member_id)).execute()
    return {"message": "Player kicked", "member_id": str(member_id)}


PlayerStatus = Literal["normal", "poisoned", "dead", "rage", "insane", "love-sick"]


class UpdateCampaignMembers(BaseModel):
    status: Optional[PlayerStatus] = None
    can_roll_dice: Optional[bool] = None


@router.patch("/campaigns/{campaign_id}/members/{member_id}")
def update_members(campaign_id: UUID, member_id: UUID, body: UpdateCampaignMembers, current_user=Depends(require_gm)):
    changes = body.model_dump(exclude_unset=True)
    if not changes:
        raise HTTPException(status_code=400, detail="Nothing to update")

    result = (
        supabase.table("campaign_members")
        .update(changes)
        .eq("campaign_id", str(campaign_id))
        .eq("id", str(member_id))
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=404, detail="Member not found")
    return {"data": result.data[0]}
