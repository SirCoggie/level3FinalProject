import os
from fastapi import FastAPI, HTTPException
#basically CORS is for frontend and backend to communicate
from fastapi.middleware.cors import CORSMiddleware
#basically pydatic a typescript for python
from pydantic import BaseModel, EmailStr
from dotenv import load_dotenv
from openai import OpenAI
from supabase import Client,create_client

# Instantiate the FastAPI
app = FastAPI()

# load environment variables from .env file
load_dotenv()

url: str = os.getenv("SUPABASE_API_URL", "")
key: str = os.getenv("SUPABASE_SECRET_KEY","")
supabase: Client = create_client(url,key)

class UserAuth(BaseModel):
    email: EmailStr
    password: str

# Configure CORS middleware
origins = [
    "http://localhost:5173",
    "http://localhost:3000"
]

api_key = os.getenv("DEEPSEEK_API_KEY")
if not api_key:
    raise RuntimeError("DEEPSEEK_API_KEY is missing")

#intialize OpenAi client pointed at DeepSeek's endpoint
ai_client = OpenAI(
    api_key=api_key,
    base_url="https://api.deepseek.com"
)


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

SYSTEM_INSTRUCTION = "You are a helpful, concise assistant."

# Health Check route (Get)
@app.get("/health")
def health_check():
    return {"status": "ok", "message": "FastApi backend is up and runnning"}

@app.post("/api/prompt", response_model=PromptResponse)
async def process_prompt(request: PromptRequest):
    try:
        completion = ai_client.chat.completions.create(
            model="deepseek-v4-flash",
            messages=[
                {
                    "role": "system",
                    "content": SYSTEM_INSTRUCTION
                },
                {
                    "role": "user",
                    "content": request.prompt
                }
            ],
            temperature=0.7
        )

        generated_text = completion.choices[0].message.content

        return PromptResponse(response=generated_text)

    except Exception as e:
        print(f"Error calling LLM API: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Error: {str(e)}"
        )

@app.post("/api/register")
def register(user: UserAuth):
    try: 
        response = supabase.auth.sign_up(
            {"email": user.email, "password":user.password}
            )
        return {
            "message": "User registered successfully",
            "user_id": response.user.id if response.user else None,
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/login")
def login(user: UserAuth):
    try:
        response = supabase.auth.sign_in_with_password(
            {"email": user.email, "password":user.password}
        )
        return {
            "message": "Login successfully!",
            "access_tocken": response.session.access_tocken,
            "user": response.user.email,
        }
    except Exception as e:
        raise HTTPException(status_code=400,detail=str(e))

    #placeholder for now
    # placeholder_reply = f"Placeholder response for: '{request.prompt}'"
    # return PromptResponse(response=placeholder_reply)