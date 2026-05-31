import asyncio
import sys
import os

# Add the directory containing this script (backend) to sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.db.session import async_session_maker
from app.models.user import User
from app.core.security import get_password_hash
from sqlalchemy import select

from app.db.base_class import Base
from app.db.session import engine

from app.core.config import settings

def log(msg):
    print(msg)
    with open("setup_log.txt", "a") as f:
        f.write(msg + "\n")

async def create_superuser():
    # Clear log
    with open("setup_log.txt", "w") as f:
        f.write("STARTING SETUP\n")

    log("--- STARTING SUPERUSER CREATION ---")
    log(f"DB URL: {settings.POSTGRES_SERVER}:{settings.POSTGRES_PORT}/{settings.POSTGRES_DB}")
    try:
        # Ensure tables exist
        log("Ensuring database tables exist...")
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        log("Tables checked/created.")

        async with async_session_maker() as db:
            # Check if user exists
            stmt = select(User).where(User.email == 'admin@medcura.com')
            result = await db.execute(stmt)
            user = result.scalars().first()
            
            if user:
                log(f"User admin@medcura.com ALREADY EXISTS with ID: {user.id}")
                # Update password just in case
                user.hashed_password = get_password_hash('password')
                db.add(user)
                await db.commit()
                log("Password updated to 'password'.")
                return

            log("Creating new user...")
            user = User(
                email='admin@medcura.com', 
                hashed_password=get_password_hash('password'), 
                is_active=True, 
                is_superuser=True, 
                full_name='Admin User'
            )
            db.add(user)
            await db.commit()
            log("Superuser created successfully.")
    except Exception as e:
        log(f"CRITICAL ERROR: {e}")
        import traceback
        with open("setup_log.txt", "a") as f:
            traceback.print_exc(file=f)

if __name__ == "__main__":
    if sys.platform == 'win32':
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    asyncio.run(create_superuser())
