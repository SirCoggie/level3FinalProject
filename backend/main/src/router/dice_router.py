import secrets
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from uuid import UUID
from datetime import datetime, timezone, timedelta
from typing import Literal, Optional
from src.authentification.db import supabase
from src.authentification.authentification_function import get_app_user, get_membership

router = APIRouter()

DiceType = Literal["d4", "d6", "d8", "d10", "d12", "d20", "d100"]
SIDES = {"d4": 4, "d6": 6, "d8": 8, "d10": 10, "d12": 12, "d20": 20, "d100": 100}
LOCK_SECONDS = 5


def ensure_can_roll(member: dict, campaign: dict):
    if member["status"] == "dead":
        raise HTTPException(status_code=403, detail="character is dead")
    if not member["can_roll_dice"]:
        raise HTTPException(status_code=403, detail="Your ability to roll dice is paused")
    if campaign["dice_rolling_paused"] and member["role"] != "gm":
        raise HTTPException(status_code=403, detail="The world has paused all rolls")


def ensure_not_locked(campaign_id: str):
    latest = (
        supabase.table("dice_rolls")
        .select("rolled_at")
        .eq("campaign_id", campaign_id)
        .order("rolled_at", desc=True)
        .limit(1)
        .execute()
    )
    if latest.data:
        last = datetime.fromisoformat(latest.data[0]["rolled_at"].replace("Z", "+00:00"))
        if datetime.now(timezone.utc) - last < timedelta(seconds=LOCK_SECONDS):
            raise HTTPException(status_code=429, detail="Wait for a moment to process the dice roll!")


class RollRequest(BaseModel):
    dice_type: DiceType
    character_id: Optional[UUID] = None


@router.post("/campaigns/{campaign_id}/rolls")
def roll_dice(campaign_id: UUID, body: RollRequest, current_user=Depends(get_app_user)):
    member = get_membership(campaign_id, current_user["id"])

    campaign = (
        supabase.table("campaigns")
        .select("dice_rolling_paused")
        .eq("id", str(campaign_id))
        .execute()
    )
    if not campaign.data:
        raise HTTPException(status_code=404, detail="Campaign not found")

    character = (
        supabase.table("characters")
        .select("id")
        .eq("campaign_id", str(campaign_id))
        .eq("user_id", current_user["id"])
        .eq("is_active", True)
        .execute()
    )

    if not character.data and member["role"] != "gm":
        raise HTTPException(status_code=404, detail="You have no active character yet!")
    character_id = character.data[0]["id"] if character.data else None

    ensure_can_roll(member, campaign.data[0])
    ensure_not_locked(str(campaign_id))

    result = secrets.randbelow(SIDES[body.dice_type]) + 1

    saved = supabase.table("dice_rolls").insert({
        "campaign_id": str(campaign_id),
        "user_id": current_user["id"],
        "character_id": character_id,
        "dice_type": body.dice_type,
        "result": result,
    }).execute()
    return {"data": saved.data[0]}


@router.get("/campaigns/{campaign_id}/rolls")
def roll_history(campaign_id: UUID, limit: int = 20, current_user=Depends(get_app_user)):
    get_membership(campaign_id, current_user["id"])
    result = (
        supabase.table("dice_rolls")
        .select("id,dice_type,result,rolled_at,user_id,characters(name)")
        .eq("campaign_id", str(campaign_id))
        .order("rolled_at", desc=True)
        .limit(limit)
        .execute()
    )
    return {"data": result.data}
