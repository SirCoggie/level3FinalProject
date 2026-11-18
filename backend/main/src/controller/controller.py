from src.router.gm_authentification import router as authentification_router
from src.router.ai_router import router as ai_router
from src.router.campaigns_router import router as campaign_router
from src.router.character_router import router as character_router
from src.router.member_router import router as member_router
from src.router.dice_router import router as dice_router
from src.router.player_authentification import router as player_authentification

def intializeRoutes(app):

    app.include_router(authentification_router)
    app.include_router(ai_router)
    app.include_router(campaign_router)
    app.include_router(character_router)
    app.include_router(member_router)
    app.include_router(dice_router)
    app.include_router(player_authentification)