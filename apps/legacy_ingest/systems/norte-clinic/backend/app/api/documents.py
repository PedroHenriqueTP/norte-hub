from fastapi import APIRouter, Depends, HTTPException
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from io import BytesIO
from base64 import b64encode
from pydantic import BaseModel
from app.db.base import get_db
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.deps import get_current_user
from app.models.user import User

router = APIRouter(prefix="/documents", tags=["documents"])

class DocumentRequest(BaseModel):
    type: str # receita, atestado, etc.
    patient: str
    details: str

@router.post("/generate")
async def generate_document(
    data: DocumentRequest, 
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    buffer = BytesIO()
    p = canvas.Canvas(buffer, pagesize=A4)
    
    # Header
    p.setFont("Helvetica-Bold", 16)
    p.drawString(100, 800, "MedCura CRM - Documento Oficial")
    
    # Content Logic
    p.setFont("Helvetica", 12)
    
    if data.type == "receita":
        p.drawString(100, 750, "RECEITA MÉDICA")
        p.drawString(100, 700, f"Paciente: {data.patient}")
        p.drawString(100, 680, f"Médico: {current_user.full_name or current_user.email}")
        p.drawString(100, 650, "Prescrição:")
        
        # Simple text wrapping could be added here, for now just drawing
        text_object = p.beginText(100, 630)
        text_object.textLines(data.details)
        p.drawText(text_object)
        
    elif data.type == "atestado":
        p.drawString(100, 750, "ATESTADO MÉDICO")
        p.drawString(100, 700, f"Atesto para os devidos fins que o paciente {data.patient}")
        p.drawString(100, 680, f"foi atendido nesta data e necessita de repelouso.")
        p.drawString(100, 650, f"Detalhes: {data.details}")

    elif data.type == "recibo":
         p.drawString(100, 750, "RECIBO DE PAGAMENTO")
         p.drawString(100, 700, f"Recebemos de {data.patient}")
         p.drawString(100, 680, f"Referente a serviços médicos.")
         p.drawString(100, 650, f"Valor/Detalhes: {data.details}")
    
    else:
        # Default template
        p.drawString(100, 750, data.type.upper())
        p.drawString(100, 700, f"Paciente: {data.patient}")
        p.drawString(100, 650, data.details)

    # Footer
    p.drawString(100, 100, "__________________________________________")
    p.drawString(100, 85, f"Dr(a). {current_user.full_name or 'Médico Responsável'}")
    p.drawString(100, 70, datetime.now().strftime("%d/%m/%Y"))
    
    p.save()
    buffer.seek(0)
    pdf_base64 = b64encode(buffer.read()).decode()
    
    return {"pdf_base64": pdf_base64}

from datetime import datetime
