from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.api import deps
from app.models.patient import Patient
from app.schemas.patient import Patient, PatientCreate

router = APIRouter()

@router.get("/", response_model=List[Patient])
async def read_patients(
    db: AsyncSession = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user = Depends(deps.get_current_active_user),
) -> Any:
    """
    Retrieve patients.
    """
    from sqlalchemy.orm import selectinload
    result = await db.execute(select(Patient).options(selectinload(Patient.appointments)).offset(skip).limit(limit))
    patients = result.scalars().all()
    
    # Compute next appointment
    from datetime import datetime
    for p in patients:
        future_appts = [a for a in p.appointments if a.start_time > datetime.now()]
        if future_appts:
            future_appts.sort(key=lambda x: x.start_time)
            # We need to set this dynamically, careful with Pydantic serialization
            # Since p is a SQLAlchemy model, we can attach arbitrary attributes if not strict
            # But converting to Pydantic model first is safer
            pass
            
    # Manual conversion to ensure field is present
    return [
        {
            **p.__dict__, 
            "next_appointment": sorted([a.start_time for a in p.appointments if a.start_time > datetime.now()])[0] if any(a.start_time > datetime.now() for a in p.appointments) else None
        } 
        for p in patients
    ]

@router.post("/", response_model=Patient)
async def create_patient(
    *,
    db: AsyncSession = Depends(deps.get_db),
    patient_in: PatientCreate,
    current_user = Depends(deps.get_current_active_user),
) -> Any:
    """
    Create new patient.
    """
    patient = Patient(**patient_in.dict())
    db.add(patient)
    await db.commit()
    await db.refresh(patient)
    return patient
