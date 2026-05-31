import asyncio
from sqlalchemy import text
from app.db.base import Base, engine, AsyncSessionLocal
from app.models.user import User
from app.models.patient import Patient
from app.models.appointment import Appointment
from app.models.consultation import Consultation
from app.models.financial import Invoice
from app.models.documents import Document
from app.models.message import Message
from app.models.subscription import Subscription, Plan
# Dynamic import to avoid error if function name changed
try:
    from app.core.security import get_password_hash
except ImportError:
    from passlib.context import CryptContext
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    def get_password_hash(password):
        return pwd_context.hash(password)

async def reset_and_seed():
    print("🗑️  Resetting Database (Drop & Create)...")
    
    # Robust Drop & Create using run_sync for metadata operations
    async with engine.begin() as conn:
        # Drop schema public CASCADE to wipe everything clean
        await conn.execute(text("DROP SCHEMA IF EXISTS public CASCADE;"))
        await conn.execute(text("CREATE SCHEMA public;"))
        await conn.execute(text("GRANT ALL ON SCHEMA public TO public;"))
        
        # Create all tables (sync mode required for metadata.create_all)
        await conn.run_sync(Base.metadata.create_all)
    
    print("🌱  Seeding Data...")
    async with AsyncSessionLocal() as db:
        users_data = [
            {"email": "admin@medcura.com", "password": "admin123", "role": "admin", "full_name": "Administrador"},
            {"email": "doctor@medcura.com", "password": "doc123", "role": "doctor", "full_name": "Dr. Doctor"},
        ]
        
        for u in users_data:
            # Bcrypt limit: 72 bytes
            hashed = get_password_hash(u["password"][:72])
            user = User(
                email=u["email"], 
                hashed_password=hashed, 
                role=u["role"],
                full_name=u["full_name"],
                is_active=True,
                is_superuser=(u["role"] == "admin") # Auto-promote admin role to superuser
            )
            db.add(user)
        
        await db.commit()
        print(f"✅ Created {len(users_data)} users.")

if __name__ == "__main__":
    try:
        asyncio.run(reset_and_seed())
        print("🎉 Database Reset & Seed Complete!")
    except Exception as e:
        print(f"❌ Error during reset: {e}")
        import traceback
        traceback.print_exc()
