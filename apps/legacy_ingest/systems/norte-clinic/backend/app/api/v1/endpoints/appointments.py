from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.api import deps
from app.models.appointment import Appointment
from app.schemas.appointment import Appointment as AppointmentSchema, AppointmentCreate
from app.services.google_calendar import google_calendar_service

router = APIRouter()

@router.get("/", response_model=List[AppointmentSchema])
async def read_appointments(
    db: AsyncSession = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user = Depends(deps.get_current_active_user),
) -> Any:
    result = await db.execute(select(Appointment).offset(skip).limit(limit))
    return result.scalars().all()

@router.post("/", response_model=AppointmentSchema)
async def create_appointment(
    *,
    db: AsyncSession = Depends(deps.get_db),
    appointment_in: AppointmentCreate,
    current_user = Depends(deps.get_current_active_user),
    background_tasks: BackgroundTasks
) -> Any:
    appointment = Appointment(**appointment_in.dict(), doctor_id=current_user.id)
    
    # Sync with Google Calendar
    # In a real app, we'd fetch patient name, etc.
    event_id = await google_calendar_service.create_event(
        summary="Medical Appointment",
        start_time=appointment.start_time,
        end_time=appointment.end_time,
        description=appointment.notes or ""
    )
    appointment.google_event_id = event_id
    
    db.add(appointment)
    await db.commit()
    await db.refresh(appointment)
    return appointment
