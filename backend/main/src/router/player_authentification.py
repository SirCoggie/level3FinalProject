import secrets
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from uuid import UUID
from src.authentification.db import supabase, auth_client
from src.authentification.authentification_function import require_gm

router = APIRouter()


def frontend_url() -> str:
    return "https://dnd-final-project.vercel.app"


def seat_email(invite_id: str) -> str:
    return f"seat-{invite_id}@seats.invalid"


def create_seat(invite: dict) -> dict:
    email = seat_email(invite["id"])
    password = secrets.token_urlsafe(24)

    try:
        auth_user = supabase.auth.admin.create_user({
            "email": email,
            "password": password,
            "email_confirm": True,
        }).user
    except Exception as e:
        raise HTTPException(status_code=409, detail=f"Seat is being created, open the link again: {e}")

    app_user = None
    try:
        app_user = supabase.table("app_users").insert({
            "auth_id": auth_user.id,
            "email": email,
        }).execute().data[0]

        supabase.table("campaign_members").insert({
            "campaign_id": invite["campaign_id"],
            "user_id": app_user["id"],
            "role": invite["role"],
        }).execute()

        supabase.table("invite_tokens").update({
            "seat_user_id": app_user["id"],
            "seat_password": password,
        }).eq("id", invite["id"]).execute()

    except Exception as e:
        if app_user:
            supabase.table("campaign_members").delete().eq("user_id", app_user["id"]).execute()
            supabase.table("app_users").delete().eq("id", app_user["id"]).execute()
        supabase.auth.admin.delete_user(auth_user.id)
        raise HTTPException(status_code=500, detail=f"could not create seat: {e}")

    return {"email": email, "password": password}


class CreateInvite(BaseModel):
    name: str


@router.post("/campaigns/{campaign_id}/invites")
def create_invite(campaign_id: UUID, body: CreateInvite, current_user=Depends(require_gm)):
    token = secrets.token_urlsafe(24)

    result = supabase.table("invite_tokens").insert({
        "token": token,
        "name": body.name,
        "campaign_id": str(campaign_id),
        "role": "players",
        "created_by": current_user["id"],
    }).execute()

    return {"invite_id": result.data[0]["id"], "name": body.name, "link": f"{frontend_url()}/join/{token}"}


@router.post("/api/join/{token}")
def join(token: str):
    found = (
        supabase.table("invite_tokens")
        .select("id,name,campaign_id,role,seat_user_id,seat_password")
        .eq("token", token)
        .execute()
    )
    if not found.data:
        raise HTTPException(status_code=404, detail="Not valid token!")

    invite = found.data[0]

    if invite["seat_password"] is None:
        creds = create_seat(invite)
    else:
        creds = {"email": seat_email(invite["id"]), "password": invite["seat_password"]}

    try:
        res = auth_client.auth.sign_in_with_password({
            "email": creds["email"],
            "password": creds["password"],
        })
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Cannot invite the player in. login failure: {e}")

    return {
        "access_token": res.session.access_token,
        "refresh_token": res.session.refresh_token,
        "campaign_id": invite["campaign_id"],
        "seat_name": invite["name"],
    }


@router.post("/campaigns/{campaign_id}/invites/{invite_id}/new-link")
def new_invite_link(campaign_id: UUID, invite_id: UUID, current_user=Depends(require_gm)):
    new_token = secrets.token_urlsafe(24)

    result = (
        supabase.table("invite_tokens")
        .update({"token": new_token})
        .eq("campaign_id", str(campaign_id))
        .eq("id", str(invite_id))
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=404, detail="Invite not found!")

    return {"link": f"{frontend_url()}/join/{new_token}"}


@router.delete("/campaigns/{campaign_id}/invites/{invite_id}")
def delete_invite(campaign_id: UUID, invite_id: UUID, current_user=Depends(require_gm)):
    result = (
        supabase.table("invite_tokens")
        .delete()
        .eq("campaign_id", str(campaign_id))
        .eq("id", str(invite_id))
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=404, detail="Cannot be deleted!")

    return {"messages": "invite deleted!"}


@router.get("/campaigns/{campaign_id}/invites")
def list_invites(campaign_id: UUID, current_user=Depends(require_gm)):
    result = (
        supabase.table("invite_tokens")
        .select("id,name,seat_user_id,token")
        .eq("campaign_id", str(campaign_id))
        .execute()
    )
    data = [
        {
            "id": row["id"],
            "name": row["name"],
            "seat_user_id": row["seat_user_id"],
            "link": f"{frontend_url()}/join/{row['token']}",
        }
        for row in result.data
    ]
    return {"data": data}
