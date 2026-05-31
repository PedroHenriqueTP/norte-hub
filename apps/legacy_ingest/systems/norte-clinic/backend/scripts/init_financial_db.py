import asyncio
import sys
import os

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.db.session import engine
from app.models.financial import Base
from app.models.user import User  # Import User so Base knows about it

async def init_financial_db():
    print("Creating Financial tables...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("Financial tables created.")

if __name__ == "__main__":
    asyncio.run(init_financial_db())
