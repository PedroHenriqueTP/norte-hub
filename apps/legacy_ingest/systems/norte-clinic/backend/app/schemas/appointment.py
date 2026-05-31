from typing import Optional
from datetime import datetime
from pydantic import BaseModel, ConfigDict
from app.models.appointment import AppointmentStatus

class AppointmentBase(BaseModel):
    patient_id: int
    start_time: datetime
    end_time: datetime
    status: Optional[AppointmentStatus] = AppointmentStatus.SCHEDULED
    notes: Optional[str] = None
    google_event_id: Optional[str] = None

class AppointmentCreate(AppointmentBase):
    pass

class AppointmentUpdate(AppointmentBase):
    patient_id: Optional[int] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None

class Appointment(AppointmentBase):
    id: int
    doctor_id: int

    model_config = ConfigDict(from_attributes=True)
