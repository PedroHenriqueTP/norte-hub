from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.api import deps
from app.db.session import get_db
from app.models.consultation import Consultation
from app.models.patient import Patient

router = APIRouter()

@router.get("/", response_model=List[dict])
def read_consultations(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user = Depends(deps.get_current_active_user),
) -> Any:
    """
    Retrieve consultations.
    """
    consultations = db.query(Consultation).order_by(desc(Consultation.date)).offset(skip).limit(limit).all()
    # Manual serialization to avoid complex Pydantic models for now
    return [{
        "id": c.id,
        "date": c.date,
        "patient_name": c.patient.full_name if c.patient else "Unknown",
        "doctor_name": c.doctor.full_name if c.doctor else "Unknown",
        "complaints": c.complaints,
        "diagnosis": c.diagnosis,
        "prescription": c.prescription,
        "exam_files": c.exam_files
    } for c in consultations]

@router.post("/", response_model=dict)
def create_consultation(
    *,
    db: Session = Depends(deps.get_db),
    patient_id: int,
    complaints: str = None,
    diagnosis: str = None,
    prescription: str = None,
    exam_files: str = None, # Comma separated
    current_user = Depends(deps.get_current_active_user),
) -> Any:
    """
    Create new consultation.
    """
    consultation = Consultation(
        patient_id=patient_id,
        doctor_id=current_user.id,
        complaints=complaints,
        diagnosis=diagnosis,
        prescription=prescription,
        exam_files=exam_files
    )
    db.add(consultation)
    db.commit()
    db.refresh(consultation)
    return {
        "id": consultation.id,
        "status": "created"
    }

@router.get("/patient/{patient_id}", response_model=List[dict])
def read_patient_consultations(
    patient_id: int,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get consultations by patient ID.
    """
    consultations = db.query(Consultation).filter(Consultation.patient_id == patient_id).order_by(desc(Consultation.date)).all()
    return [{
        "id": c.id,
        "date": c.date,
        "doctor_name": c.doctor.full_name if c.doctor else "Unknown",
        "complaints": c.complaints,
        "diagnosis": c.diagnosis,
        "prescription": c.prescription
    } for c in consultations]
