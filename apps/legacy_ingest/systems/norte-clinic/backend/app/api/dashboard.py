from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc, and_
from typing import Any, List, Optional
from datetime import datetime

from app.db.base import get_db
from app.models.user import User
from app.models.patient import Patient
from app.models.appointment import Appointment, AppointmentStatus
from app.models.consultation import Consultation
from app.core import security
from app.api import deps
from pydantic import BaseModel

router = APIRouter()

class DashboardStats(BaseModel):
    total_patients: int
    total_appointments_future: int
    total_consultations_past: int
    next_appointment: Optional[dict] = None

@router.get("/stats", response_model=DashboardStats)
async def get_dashboard_stats(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get executive dashboard statistics:
    - Total Patients
    - Future Appointments
    - Past Consultations
    - Next Appointment details
    """
    
    # 1. Total Patients
    # If doctor, maybe filter by doctor? For now, system-wide or doctor specific depending on reqs.
    # Let's assume system wide for admin, doctor specific for doctor if needed.
    # Simple version: All patients
    query_patients = select(func.count(Patient.id))
    result_patients = await db.execute(query_patients)
    total_patients = result_patients.scalar() or 0

    # 2. Future Appointments
    now = datetime.now()
    query_future_apps = select(func.count(Appointment.id)).where(Appointment.start_time > now)
    result_future_apps = await db.execute(query_future_apps)
    total_future = result_future_apps.scalar() or 0

    # 3. Past Consultations (Completed)
    query_consultations = select(func.count(Consultation.id))
    result_consultations = await db.execute(query_consultations)
    total_consultations = result_consultations.scalar() or 0

    # 4. Next Appointment
    # Get the single next appointment
    query_next = (
        select(Appointment)
        .where(Appointment.start_time > now)
        .order_by(Appointment.start_time.asc())
        .limit(1)
    )
    result_next = await db.execute(query_next)
    next_app = result_next.scalars().first()

    next_app_data = None
    if next_app:
        # We need patient name. Assuming relationship is eager loaded or we fetch it.
        # Let's fetch the patient to be sure
        patient_query = select(Patient).where(Patient.id == next_app.patient_id)
        patient_result = await db.execute(patient_query)
        patient = patient_result.scalars().first()
        
        patient_name = patient.name if patient else "Desconhecido"
        
        next_app_data = {
            "id": next_app.id,
            "patient_name": patient_name,
            "start_time": next_app.start_time.isoformat(),
            "status": next_app.status
        }

    return {
        "total_patients": total_patients,
        "total_appointments_future": total_future,
        "total_consultations_past": total_consultations,
        "next_appointment": next_app_data
    }
