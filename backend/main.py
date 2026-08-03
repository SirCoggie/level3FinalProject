from fastapi import FastAPI
#basically CORS is for frontend and backend to communicate
from fastapi.middleware.cors import CORSMiddleware
#basically pydatic a typescript for python
from pydantic import BaseModel

# Instantiate the FastAPI
app = FastAPI()

# Configure CORS middleware
origins = [
    "http://localhost:5173",
    "http://localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# define pydatic schemas for data validation
class PromptRequest(BaseModel):
    prompt: str

class PromptResponse(BaseModel):
    response: str

# Health Check route (Get)
@app.get("/")
def health_check():
    return {"status": "ok", "message": "FastApi backend is up and runnning"}

@app.post("/api/prompt", response_model=PromptResponse)
def process_prompt(request: PromptRequest):
    #placeholder for now
    placeholder_reply = f"Placeholder response for: '{request.prompt}'"
    return PromptResponse(response=placeholder_reply)