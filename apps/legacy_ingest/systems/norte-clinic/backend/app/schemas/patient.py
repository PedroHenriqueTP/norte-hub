from typing import Optional
from datetime import date, datetime
from pydantic import BaseModel, EmailStr, ConfigDict


class PatientBase(BaseModel):
    full_name: str
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    birth_date: Optional[str] = None
    address: Optional[str] = None
    notes: Optional[str] = None

class PatientCreate(PatientBase):
    pass

class PatientUpdate(PatientBase):
    pass

class Patient(PatientBase):
    id: int
    created_at: Optional[datetime]
    updated_at: Optional[datetime]
    next_appointment: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
