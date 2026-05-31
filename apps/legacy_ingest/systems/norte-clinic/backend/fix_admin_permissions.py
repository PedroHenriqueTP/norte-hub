import asyncio
from sqlalchemy import text, select
from app.db.base import AsyncSessionLocal
from app.models.user import User

async def fix_admin_permissions():
    print("🔧 Fixing Admin Permissions...")
    async with AsyncSessionLocal() as db:
        result = await db.execute(select(User).where(User.email == "admin@medcura.com"))
        user = result.scalars().first()
        
        if user:
            user.is_superuser = True
            user.role = "admin"
            db.add(user)
            await db.commit()
            print(f"✅ User {user.email} promoted to Superuser (is_superuser=True).")
        else:
            print("⚠️ Admin user not found. Run seed script properly.")

if __name__ == "__main__":
    asyncio.run(fix_admin_permissions())
