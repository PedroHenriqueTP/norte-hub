# backend/seed_users.py
import asyncio
from app.db.base import AsyncSessionLocal, engine, Base
from app.models.user import User
from app.models.patient import Patient
from app.models.appointment import Appointment
from app.models.consultation import Consultation
from app.models.financial import Invoice
from app.models.documents import Document
from app.models.message import Message
from app.models.subscription import Subscription
from app.crud.user import create_user
from sqlalchemy import text

async def seed_users():
    # Create tables if they don't exist
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as db:
        try:
             # Optional: clear users table for clean seed
            await db.execute(text("TRUNCATE TABLE users RESTART IDENTITY CASCADE"))
            
            # Create users using the CRUD function which handles hashing
            admin = await create_user(db, {"username": "admin@medcura.com", "password": "admin123", "role": "admin", "full_name": "Administrador"})
            doctor = await create_user(db, {"username": "doctor@medcura.com", "password": "doc123", "role": "doctor", "full_name": "Dr. Silva"})
            patient = await create_user(db, {"username": "patient@medcura.com", "password": "pat123", "role": "patient", "full_name": "Paciente Teste"})
            
            print(f"✅ Created users: \n- {admin.email} (admin)\n- {doctor.email} (doctor)\n- {patient.email} (patient)")
        except Exception as e:
            print(f"❌ Error seeding users: {e}")
            await db.rollback()
        finally:
            await db.close()

if __name__ == "__main__":
    asyncio.run(seed_users())
