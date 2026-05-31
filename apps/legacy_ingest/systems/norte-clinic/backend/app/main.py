# backend/app/main.py
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.api import dashboard
from app.core.config import settings
from app.db.session import engine
from app.db.base import Base # Use the new base we created

# Import models to ensure they are registered for create_all
from app.models.patient import Patient
from app.models.appointment import Appointment
from app.models.user import User 
from app.models.consultation import Consultation 
from app.models.financial import Invoice
from app.models.documents import Document 
from app.models.message import Message 
from app.models.subscription import Subscription

@asynccontextmanager
async def lifespan(app: FastAPI):
    # DEV ONLY: Create tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield

app = FastAPI(
    title=settings.PROJECT_NAME, 
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan
)

from app.core.middleware import TenantMiddleware

# Set all CORS enabled origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "*"], # Allow frontend and wildcard
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add Tenant Isolation Middleware
app.add_middleware(TenantMiddleware)

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "Medical CRM Backend"}

# Mount static files
app.mount("/static", StaticFiles(directory="static"), name="static")

# Include routers
from app.api import dashboard
app.include_router(dashboard.router, prefix="/api/v1/dashboard", tags=["dashboard"])

from app.api import users, auth, patients, documents
app.include_router(users.router, prefix="/api/v1")
app.include_router(auth.router, prefix="/api") # Usually auth is /api/v1/auth or /api/login in auth.router
app.include_router(patients.router, prefix="/api/v1")
app.include_router(documents.router, prefix="/api/v1")
from app.api import consultations, financial
app.include_router(consultations.router, prefix="/api/v1")
app.include_router(financial.router, prefix="/api/v1")
from app.api.v1.endpoints import admin
app.include_router(admin.router, prefix="/api/v1/admin", tags=["admin"])
from app.api import whatsapp
app.include_router(whatsapp.router, prefix="/api/v1")


@app.get("/")
def root():
    return {"message": "MedCura CRM API - Status OK"}
