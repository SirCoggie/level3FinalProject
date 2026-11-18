from fastapi.middleware.cors import CORSMiddleware

def middleware(app):
    origins = [
        "https://level3-final-project-1a83g4o44-seong-jin-s-projects.vercel.app/",
        "https://level3finalproject.onrender.com/"
    ]

    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"]
    )