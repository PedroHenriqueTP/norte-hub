from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from app.db.base import Base
import datetime
import enum

class MessageSource(str, enum.Enum):
    USER = "user"       # From WhatsApp (Patient)
    BOT = "bot"         # AI Response
    DOCTOR = "doctor"   # Manual Doctor Response

class Message(Base):
    __tablename__ = "messages"
    id = Column(Integer, primary_key=True, index=True)
    patient_phone = Column(String, index=True, nullable=False)
    content = Column(Text, nullable=False)
    source = Column(String, default=MessageSource.USER)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    
    # Optional: Link to a patient if phone matches
    # patient_id = Column(Integer, ForeignKey("patient.id"), nullable=True)
