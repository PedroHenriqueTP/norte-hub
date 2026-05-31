import asyncio
import sys
import os
import logging
import requests

# Add the directory containing this script (backend) to sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Silence SQLAlchemy logs
logging.basicConfig()
logging.getLogger('sqlalchemy.engine').setLevel(logging.WARNING)

from app.db.session import async_session_maker
from app.models.user import User
from app.core.security import verify_password
from sqlalchemy import select

def log(msg):
    print(msg)
    with open("debug_output.txt", "a") as f:
        f.write(msg + "\n")

async def check_user():
    # Clear log
    with open("debug_output.txt", "w") as f:
        f.write("STARTING DEBUG\n")

    log("--- CHECKING DATABASE ---")
    try:
        async with async_session_maker() as session:
            query = select(User).where(User.email == "admin@medcura.com")
            result = await session.execute(query)
            user = result.scalars().first()

            if user:
                log(f"User FOUND: {user.email}")
                # Test password
                is_valid = verify_password("password", user.hashed_password)
                log(f"Password 'password' matches hash: {is_valid}")
                if not is_valid:
                    log(f"Hash in DB: {user.hashed_password}")
            else:
                log("User NOT FOUND in database.")
    except Exception as e:
        log(f"DB Error: {e}")

def check_api():
    log("\n--- CHECKING API ENDPOINT ---")
    url = "http://localhost:8000/api/v1/login/access-token"
    payload = {'username': 'admin@medcura.com', 'password': 'password'}
    try:
        response = requests.post(url, data=payload)
        log(f"Status Code: {response.status_code}")
        log(f"Response: {response.text}")
    except Exception as e:
        log(f"API Request Failed: {e}")

if __name__ == "__main__":
    if os.name == 'nt':
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    asyncio.run(check_user())
    check_api()
