import os
from fastapi.middleware.cors import CORSMiddleware


def middleware(app):
    # Comma-separated list, e.g. "https://dnd-final-project.vercel.app,http://localhost:5173"
    # Browsers send the Origin header with no trailing slash, so strip any here.
    raw_origins = os.getenv("CORS_ORIGINS", "http://localhost:5173")
    origins = [o.strip().rstrip("/") for o in raw_origins.split(",") if o.strip()]

    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"]
    )
