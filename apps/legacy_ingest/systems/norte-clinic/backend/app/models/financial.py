from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.base import Base

class Invoice(Base):
    __tablename__ = "invoices"
    id = Column(Integer, primary_key=True, index=True)
    doctor_id = Column(Integer, ForeignKey("users.id"))
    patient_name = Column(String, index=True)
    amount = Column(Float, nullable=False)
    description = Column(String, nullable=True)
    date = Column(DateTime, default=datetime.utcnow)
    pdf_url = Column(String, nullable=True)
    
    doctor = relationship("User", back_populates="invoices")

# We need to add 'invoices' relationship to User model later or just ignore back_populates for now if circular import issues arise.
# For simplicity, let's keep it unidirectional or update User later.
