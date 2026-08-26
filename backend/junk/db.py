from sqlalchemy import create_engine, Metadata
from database import Database

DATABASE_URL = "sqlite:///./users.db"

database = Database(DATABASE_URL)
metadata = Metadata()
engine = create_engine(DATABASE_URL)