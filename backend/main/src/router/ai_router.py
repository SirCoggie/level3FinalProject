import os
from dotenv import load_dotenv
from pydantic import BaseModel
from fastapi import APIRouter, HTTPException,Depends
load_dotenv()
from src.authentification.authentification_function import require_real_gm_account
from openai import OpenAI

router = APIRouter()

api_key = os.getenv("DEEPSEEK_API_KEY")
if not api_key:
    raise RuntimeError("api key is missing")

ai_client = OpenAI(
    api_key=api_key,
    base_url="https://api.deepseek.com"
)

class PromptRequest(BaseModel):
    prompt: str

class PromptResponse(BaseModel):
    response: str

SYSTEM_INSTRUCTION = "You are a helpful, concise assistant."

@router.post("/api/prompt", response_model=PromptResponse)
def process_prompt(request: PromptRequest,current_user = Depends(require_real_gm_account)):
    try:
        completion = ai_client.chat.completions.create(
            model="deepseek-flash",
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
            temperature=0.7,
        )

        generated_text = completion.choices[0].message.content

        return PromptResponse(response=generated_text)

    except Exception as e:
        print(f"Error calling LLM API: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Error: {str(e)}"
        )