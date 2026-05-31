from sqlalchemy import Column, Integer, String, Text, ForeignKey, TIMESTAMP
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base import Base

class Consultation(Base):
    __tablename__ = "consultations"
    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)
    doctor_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    date = Column(TIMESTAMP, server_default=func.now())
    
    complaints = Column(Text, nullable=True) # Queixas
    diagnosis = Column(Text, nullable=True) # Diagnostico
    prescription = Column(Text, nullable=True) # Prescricao/Receita
    
    # Store exam file URLs as a comma-separated string or JSON string for simplicity
    exam_files = Column(Text, nullable=True) 

    patient = relationship("Patient", back_populates="consultations")
    doctor = relationship("User", back_populates="consultations")
