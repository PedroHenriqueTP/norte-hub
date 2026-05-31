from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.base import Base

class Document(Base):
    __tablename__ = "documents"
    id = Column(Integer, primary_key=True, index=True)
    doctor_id = Column(Integer, ForeignKey("users.id"))
    type = Column(String, default="certificate") # certificate, prescription, etc
    patient_name = Column(String, index=True)
    content = Column(String, nullable=True) # JSON or Text content (e.g. Days off, CID)
    pdf_url = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    doctor = relationship("User", back_populates="documents")

# Note: We need to ensure User model has 'documents = relationship("Document", back_populates="doctor")'
# For now, we rely on SA registry or add it to User model if strictly needed for eager load.
