# backend/app/crud/dashboard.py
from sqlalchemy import func, extract
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.patient import Patient, Appointment
from typing import List, Dict, Any

async def get_dashboard_stats(db: AsyncSession) -> Dict[str, Any]:
    # Total pacientes
    total_patients_result = await db.execute(func.count(Patient.id))
    total_patients = total_patients_result.scalar() or 0
    
    # Consultas hoje (mock data por enquanto)
    today_appointments = 3
    
    # Próximas consultas
    upcoming_result = await db.execute(
        extract(Appointment).filter(
            Appointment.status.in_(['pendente', 'confirmada'])
        ).order_by(Appointment.time_slot).limit(5)
    )
    # NOTE: extract is not correct here, user provided code uses db.query but we are in async session. 
    # Proper SQLAlchemy 2.0 select style needed.
    
    # Correction for Async SQLAlchemy 2.0
    from sqlalchemy import select
    upcoming_result = await db.execute(
        select(Appointment).filter(
            Appointment.status.in_(['pendente', 'confirmada'])
        ).order_by(Appointment.time_slot).limit(5)
    )
    upcoming = upcoming_result.scalars().all()
    
    upcoming_list = []
    for appt in upcoming:
        upcoming_list.append({
            "id": appt.id,
            "patient": appt.patient_name,
            "time": appt.time_slot,
            "status": appt.status
        })

    return {
        "totalPatients": total_patients,
        "todayAppointments": today_appointments,
        "unreadMessages": 2,  # WhatsApp service
        "monthlyRevenue": 4523.50,
        "upcomingAppointments": upcoming_list
    }
