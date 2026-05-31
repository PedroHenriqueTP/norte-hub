# backend/seed_data.py
import asyncio
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.base import AsyncSessionLocal
from app.models.patient import Patient, Appointment
from sqlalchemy import insert

async def seed():
    async with AsyncSessionLocal() as db:
        # Check if we already have data to avoid duplicates (optional, but good practice)
        # For now, we trust the user's script logic (just insert) or we can clear first.
        # Let's delete existing just to be clean for this demo
        from sqlalchemy import text
        await db.execute(text("TRUNCATE TABLE patients RESTART IDENTITY CASCADE"))
        await db.execute(text("TRUNCATE TABLE appointments RESTART IDENTITY CASCADE"))
        
        # 127 pacientes mock
        await db.execute(insert(Patient).values([
            {"name": f"Paciente {i}", "email": f"pac{i}@exemplo.com", "phone": f"(11)9{i}000-0000"}
            for i in range(1, 128)
        ]))
        
        # 5 agendamentos
        await db.execute(insert(Appointment).values([
            {"patient_id": 1, "patient_name": "Maria Silva", "time_slot": "14:00", "status": "confirmada"},
            {"patient_id": 2, "patient_name": "João Santos", "time_slot": "16:30", "status": "pendente"},
            {"patient_id": 3, "patient_name": "Ana Clara", "time_slot": "09:00", "status": "confirmada"},
            {"patient_id": 4, "patient_name": "Roberto Carlos", "time_slot": "10:30", "status": "pendente"},
            {"patient_id": 5, "patient_name": "Julia Roberts", "time_slot": "11:00", "status": "pendente"},
        ]))
        
        await db.commit()
        print("✅ Seed concluído! 127 pacientes + 5 agendamentos")

if __name__ == "__main__":
    asyncio.run(seed())
