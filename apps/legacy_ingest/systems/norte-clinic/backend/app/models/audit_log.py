from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, JSON
from sqlalchemy.sql import func
from app.db.base_class import Base

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user.id", ondelete="SET NULL"), nullable=True) # Quem fez
    action = Column(String, nullable=False) # Ex: "UPDATE_PLAN", "DELETE_PATIENT"
    target_tenant_id = Column(Integer, nullable=True) # Em qual clínica/tenant ocorreu
    ip_address = Column(String, nullable=True)
    resource_type = Column(String, nullable=True) # Ex: "Tenant", "User", "Appointment"
    resource_id = Column(String, nullable=True) # ID do objeto afetado
    metadata_json = Column(JSON, nullable=True) # Dados anteriores vs atuais
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
