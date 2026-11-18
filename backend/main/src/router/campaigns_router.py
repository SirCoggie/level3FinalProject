from fastapi import HTTPException, Depends, APIRouter
from pydantic import BaseModel
from uuid import UUID
from typing import Optional
from src.middleware.timer_function import now_iso
from src.authentification.db import supabase
from src.authentification.authentification_function import (
    get_app_user,
    get_membership,
    require_gm,
    require_real_gm_account,
)

router = APIRouter()


class CreateCampaign(BaseModel):
    name: str
    description: Optional[str] = None
    game_system_id: Optional[UUID] = None


@router.post("/campaigns")
def new_campaign(body: CreateCampaign, current_user=Depends(require_real_gm_account)):
    new_campaign = {
        "name": body.name,
        "description": body.description,
        "game_system_id": str(body.game_system_id) if body.game_system_id else None,
        "gm_user_id": current_user["id"],
    }
    response = supabase.table("campaigns").insert(new_campaign).execute()
    if not response.data:
        raise HTTPException(status_code=500, detail="Insert campaign failed")
    campaign_id = response.data[0]["id"]
    try:
        supabase.table("campaign_members").insert({
            "campaign_id": campaign_id,
            "user_id": current_user["id"],
            "role": "gm",
        }).execute()
    except Exception:
        supabase.table("campaigns").delete().eq("id", campaign_id).execute()
        raise HTTPException(status_code=500, detail="Insert GM failed")

    return {"data": response.data[0]}


@router.get("/campaigns")
def list_my_campaign(current_user=Depends(require_real_gm_account)):
    result = (
        supabase.table("campaigns")
        .select("id,name,description,is_active,created_at")
        .eq("gm_user_id", current_user["id"])
        .order("created_at", desc=True)
        .execute()
    )
    return {"data": result.data}


@router.get("/campaigns/{campaign_id}")
def get_campaign(campaign_id: UUID, current_user=Depends(get_app_user)):
    member = get_membership(campaign_id, current_user["id"])
    campaign = supabase.table("campaigns").select("*").eq("id", str(campaign_id)).execute()
    if not campaign.data:
        raise HTTPException(status_code=404, detail="Campaign not found")
    return {"data": campaign.data[0], "my_role": member["role"], "user_id": current_user["id"]}


class UpdateCampaign(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    is_active: Optional[bool] = None
    dice_rolling_paused: Optional[bool] = None


@router.patch("/campaigns/{campaign_id}")
def update_campaign(campaign_id: UUID, body: UpdateCampaign, current_user=Depends(require_gm)):
    changes = body.model_dump(exclude_unset=True)
    if not changes:
        raise HTTPException(status_code=400, detail="Nothing to update")

    changes["updated_at"] = now_iso()
    result = supabase.table("campaigns").update(changes).eq("id", str(campaign_id)).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Campaign not found")
    return {"data": result.data[0]}
