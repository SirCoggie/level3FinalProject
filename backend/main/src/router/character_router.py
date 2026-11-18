from fastapi import HTTPException, Depends, APIRouter
from pydantic import BaseModel
from uuid import UUID
from typing import Optional
from src.authentification.db import supabase
from src.authentification.authentification_function import get_membership, require_gm, get_app_user
from src.middleware.timer_function import now_iso

router = APIRouter()


class CreateCharacter(BaseModel):
    user_id: UUID
    name: str
    notes: Optional[str] = None
    sheet_data: Optional[dict] = None


def blank_sheet(campaign_id: UUID) -> dict:
    campaign = supabase.table("campaigns").select("game_system_id").eq("id", str(campaign_id)).execute()
    if not campaign.data or not campaign.data[0]["game_system_id"]:
        return {}
    game = (
        supabase.table("game_systems")
        .select("sheet_template")
        .eq("id", campaign.data[0]["game_system_id"])
        .execute()
    )
    if not game.data or not game.data[0]["sheet_template"]:
        return {}
    fields = game.data[0]["sheet_template"].get("fields", [])
    return {field: "" for field in fields}


@router.post("/campaigns/{campaign_id}/characters")
def create_characters(campaign_id: UUID, body: CreateCharacter, current_user=Depends(require_gm)):
    get_membership(campaign_id, str(body.user_id))
    sheet = body.sheet_data if body.sheet_data is not None else blank_sheet(campaign_id)

    (
        supabase.table("characters")
        .update({"is_active": False, "updated_at": now_iso()})
        .eq("campaign_id", str(campaign_id))
        .eq("user_id", str(body.user_id))
        .eq("is_active", True)
        .execute()
    )

    new_character = {
        "campaign_id": str(campaign_id),
        "user_id": str(body.user_id),
        "name": body.name,
        "notes": body.notes,
        "sheet_data": sheet,
        "is_active": True,
    }
    response = supabase.table("characters").insert(new_character).execute()
    if not response.data:
        raise HTTPException(status_code=500, detail="Insert character failed")
    return {"data": response.data[0]}


@router.get("/campaigns/{campaign_id}/characters")
def list_character(campaign_id: UUID, mine: bool = False, current_user=Depends(get_app_user)):
    get_membership(campaign_id, current_user["id"])
    query = (
        supabase.table("characters")
        .select("id,user_id,name,sheet_data,notes,is_active,created_at")
        .eq("campaign_id", str(campaign_id))
    )
    if mine:
        query = query.eq("user_id", current_user["id"])
    result = query.order("created_at", desc=True).execute()
    return {"data": result.data}


class UpdateCharacter(BaseModel):
    name: Optional[str] = None
    notes: Optional[str] = None
    sheet_data: Optional[dict] = None
    is_active: Optional[bool] = None


@router.patch("/campaigns/{campaign_id}/characters/{character_id}")
def edit_character(campaign_id: UUID, character_id: UUID, body: UpdateCharacter, current_user=Depends(require_gm)):
    changes = body.model_dump(exclude_unset=True)
    if not changes:
        raise HTTPException(status_code=400, detail="Nothing to update")

    existing = (
        supabase.table("characters")
        .select("user_id")
        .eq("id", str(character_id))
        .eq("campaign_id", str(campaign_id))
        .execute()
    )
    if not existing.data:
        raise HTTPException(status_code=404, detail="No character found!")

    if changes.get("is_active") is True:
        (
            supabase.table("characters")
            .update({"is_active": False, "updated_at": now_iso()})
            .eq("campaign_id", str(campaign_id))
            .eq("user_id", existing.data[0]["user_id"])
            .eq("is_active", True)
            .execute()
        )

    changes["updated_at"] = now_iso()
    result = (
        supabase.table("characters")
        .update(changes)
        .eq("campaign_id", str(campaign_id))
        .eq("id", str(character_id))
        .execute()
    )
    return {"data": result.data[0]}
