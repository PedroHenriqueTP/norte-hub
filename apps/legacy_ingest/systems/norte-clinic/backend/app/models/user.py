from sqlalchemy import Boolean, Column, Integer, String, Text
from sqlalchemy.orm import relationship
from app.db.base import Base

class Role:
    ADMIN = "admin"
    DOCTOR = "doctor"
    SECRETARY = "secretary"

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean(), default=True)
    is_superuser = Column(Boolean(), default=False)
    role = Column(String, default="doctor") # admin, doctor, secretary
    profile_image = Column(String, nullable=True)
    totp_secret = Column(String, nullable=True) # 2FA Secret Key

    # Extended Doctor/Settings Fields - Requires Migration
    # crm = Column(String, nullable=True)
    # personal_phone = Column(String, nullable=True)
    # chatbot_phone = Column(String, nullable=True)
    # certificate_template = Column(Text, nullable=True)
    # prescription_template = Column(Text, nullable=True)
    # receipt_template = Column(Text, nullable=True)

    # Relationships
    invoices = relationship("Invoice", back_populates="doctor")
    documents = relationship("Document", back_populates="doctor") 
    consultations = relationship("Consultation", back_populates="doctor")
    subscriptions = relationship("Subscription", back_populates="user")
