from fastapi import FastAPI
from src.middleware.CORSMiddleware_init import middleware

from src.controller.controller import intializeRoutes



app = FastAPI()

intializeRoutes(app)

middleware(app)

@app.get("/health")
def health_check():
    return {"status": "ok", "message": "FastApi backend is up and runnning"}
