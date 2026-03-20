from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
import os

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")

client = AsyncIOMotorClient(MONGO_URI)
db = client.hrms_db

async def init_db(models):
    await init_beanie(database=db, document_models=models)