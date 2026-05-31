from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime

from app.api import deps
from app.models.user import User
from app.models.financial import Invoice
from app.services.pdf_generator import pdf_service

router = APIRouter()

@router.get("/", response_model=List[dict])
async def read_invoices(
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve invoices.
    """
    query = select(Invoice).where(Invoice.doctor_id == current_user.id).offset(skip).limit(limit)
    result = await db.execute(query)
    invoices = result.scalars().all()
    return invoices

@router.post("/", response_model=dict)
async def create_invoice(
    *,
    db: AsyncSession = Depends(deps.get_db),
    patient_name: str = Body(...),
    amount: float = Body(...),
    description: str = Body(None),
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Create new invoice.
    """
    invoice = Invoice(
        doctor_id=current_user.id,
        patient_name=patient_name,
        amount=amount,
        description=description,
        date=datetime.utcnow()
    )
    db.add(invoice)
    await db.commit()
    await db.refresh(invoice)
    
    # Generate PDF
    pdf_path = pdf_service.generate_invoice({
        "invoice_id": invoice.id,
        "doctor_name": current_user.full_name,
        "patient_name": patient_name,
        "amount": amount,
        "description": description,
        "date": invoice.date
    })
    
    invoice.pdf_url = pdf_path
    db.add(invoice)
    await db.commit()
    
    return invoice
