from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime

from app.api import deps
from app.models.user import User
from app.models.documents import Document
from app.services.pdf_generator import pdf_service

router = APIRouter()

@router.get("/", response_model=List[dict])
async def read_documents(
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve documents.
    """
    query = select(Document).where(Document.doctor_id == current_user.id).offset(skip).limit(limit)
    result = await db.execute(query)
    docs = result.scalars().all()
    return docs

@router.post("/certificate", response_model=dict)
async def create_certificate(
    *,
    db: AsyncSession = Depends(deps.get_db),
    patient_name: str = Body(...),
    days: int = Body(...),
    cid: str = Body(None),
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Create new Medical Certificate.
    """
    # Use template if set
    pdf_path = pdf_service.generate_certificate({
        "doc_id": "temp", # Will update ID after save or use temp ID logic
        "doctor_name": current_user.full_name,
        "patient_name": patient_name,
        "days": days,
        "cid": cid,
        "date": datetime.now()
    }, template_path=current_user.certificate_template)
    
    doc = Document(
        doctor_id=current_user.id,
        type="certificate",
        patient_name=patient_name,
        content=f"Days: {days}, CID: {cid}",
        pdf_url=pdf_path,
        created_at=datetime.utcnow()
    )
    db.add(doc)
    await db.commit()
    await db.refresh(doc)
    return doc

@router.post("/prescription", response_model=dict)
async def create_prescription(
    *,
    db: AsyncSession = Depends(deps.get_db),
    patient_name: str = Body(...),
    content: str = Body(...),
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Create new Prescription.
    """
    pdf_path = pdf_service.generate_prescription({
        "doc_id": "temp",
        "doctor_name": current_user.full_name,
        "patient_name": patient_name,
        "content": content,
    }, template_path=current_user.prescription_template)
    
    doc = Document(
        doctor_id=current_user.id,
        type="prescription",
        patient_name=patient_name,
        content=content,
        pdf_url=pdf_path,
        created_at=datetime.utcnow()
    )
    db.add(doc)
    await db.commit()
    await db.refresh(doc)
    return doc

@router.post("/receipt", response_model=dict)
async def create_receipt(
    *,
    db: AsyncSession = Depends(deps.get_db),
    patient_name: str = Body(...),
    amount: float = Body(...),
    description: str = Body(...),
    payer_cpf: str = Body(None),
    beneficiary_name: str = Body(None),
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Create new Receipt (Invoice).
    """
    # Verify Financial Logic here usually, but simplified for Documents module
    invoice_data = {
        "invoice_id": "temp",
        "doctor_name": current_user.full_name,
        "patient_name": patient_name,
        "amount": amount,
        "description": description,
        "payer_cpf": payer_cpf,
        "beneficiary_name": beneficiary_name
    }
    
    pdf_path = pdf_service.generate_invoice(invoice_data, template_path=current_user.receipt_template)
    
    doc = Document(
        doctor_id=current_user.id,
        type="receipt",
        patient_name=patient_name,
        content=f"R$ {amount} - {description}",
        pdf_url=pdf_path,
        created_at=datetime.utcnow()
    )
    db.add(doc)
    await db.commit()
    await db.refresh(doc)
    return doc
