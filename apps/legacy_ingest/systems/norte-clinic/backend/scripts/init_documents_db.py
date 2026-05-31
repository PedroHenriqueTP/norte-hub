import asyncio
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.db.session import engine
from app.models.documents import Base
from app.models.user import User

async def init_documents_db():
    print("Creating Document tables...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("Document tables created.")

if __name__ == "__main__":
    asyncio.run(init_documents_db())
