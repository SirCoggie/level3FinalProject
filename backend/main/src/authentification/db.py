import os
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

url = os.getenv("SUPABASE_API_URL")
secret_key = os.getenv("SUPABASE_SECRET_KEY")
publishable_key = os.getenv("SUPABASE_PUBLIC_KEY")

if not url or not secret_key or not publishable_key:
    raise RuntimeError("Missing SUPABASE_API_URL, SUPABASE_SECRET_KEY or SUPABASE_PUBLIC_KEY in .env")

supabase: Client = create_client(url, secret_key)
auth_client: Client = create_client(url, publishable_key)
