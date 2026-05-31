from fastapi import APIRouter
from app.api.v1.endpoints import (
    login, users, patients, appointments,
    webhook, financial, documents, upload, consultations, backup, calendar, billing
)

api_router = APIRouter()
api_router.include_router(login.router, tags=["login"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(patients.router, prefix="/patients", tags=["patients"])
api_router.include_router(appointments.router, prefix="/appointments", tags=["appointments"])
api_router.include_router(webhook.router, prefix="/webhook", tags=["webhook"])
api_router.include_router(financial.router, prefix="/financial", tags=["financial"])
api_router.include_router(documents.router, prefix="/documents", tags=["documents"])
api_router.include_router(upload.router, prefix="/upload", tags=["upload"])
api_router.include_router(consultations.router, prefix="/consultations", tags=["consultations"])
api_router.include_router(backup.router, prefix="/backup", tags=["backup"])
api_router.include_router(calendar.router, prefix="/calendar", tags=["calendar"])
api_router.include_router(billing.router, prefix="/billing", tags=["billing"])
