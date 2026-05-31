from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List, Optional
from pydantic import BaseModel, EmailStr, validator
from datetime import datetime

from app.db.base import get_db
from app.models.patient import Patient
from app.api.deps import get_current_user
from app.models.user import User

router = APIRouter(prefix="/patients", tags=["patients"])

# Pydantic Schemas
class PatientBase(BaseModel):
    nome_completo: str
    email: Optional[EmailStr] = None
    telefone: Optional[str] = None
    data_nascimento: datetime
    endereco: Optional[str] = None
    anotacoes: Optional[str] = None
    consent_lgpd: bool

    @validator("consent_lgpd")
    def must_consent(cls, v):
        if not v:
            raise ValueError("Consentimento LGPD é obrigatório")
        return v

class PatientCreate(PatientBase):
    pass

class PatientOut(PatientBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

@router.post("/", response_model=PatientOut)
async def create_patient(
    patient: PatientCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Mapping Pydantic (Portuguese) to Model (English)
    db_patient = Patient(
        name=patient.nome_completo,
        email=patient.email,
        phone=patient.telefone,
        birth_date=patient.data_nascimento,
        address=patient.endereco,
        notes=patient.anotacoes,
        consent_lgpd=patient.consent_lgpd
    )
    
    try:
        db.add(db_patient)
        await db.commit()
        await db.refresh(db_patient)
        
        # Remap back to response if needed, or rely on ORM compatibility
        # For simplicity, we construct the response object manually if names mismatch too much
        # But here logic is simple mapping. 
        # Actually pydantic 'orm_mode' tries to read attributes.
        # We need to ensure the Pydantic model fields match the ORM attributes for automatic mapping,
        # OR providing a manual mapping.
        # Let's align the Pydantic model to match ORM for output, or use alias.
        
        return PatientOut(
             id=db_patient.id,
             nome_completo=db_patient.name,
             email=db_patient.email,
             telefone=db_patient.phone,
             data_nascimento=db_patient.birth_date,
             endereco=db_patient.address,
             anotacoes=db_patient.notes,
             consent_lgpd=db_patient.consent_lgpd,
             created_at=db_patient.created_at
        )

    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/", response_model=List[PatientOut])
async def read_patients(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(select(Patient).offset(skip).limit(limit))
    patients = result.scalars().all()
    
    return [
        PatientOut(
             id=p.id,
             nome_completo=p.name,
             email=p.email,
             telefone=p.phone,
             data_nascimento=p.birth_date,
             endereco=p.address,
             anotacoes=p.notes,
             consent_lgpd=p.consent_lgpd,
             created_at=p.created_at
        ) for p in patients
    ]
