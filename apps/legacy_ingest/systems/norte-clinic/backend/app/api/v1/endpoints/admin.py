from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.base import get_db
from app.core.rbac import RoleChecker, verify_superuser
from app.services.financial_bi import FinancialService
from app.api import deps
from typing import List, Any

router = APIRouter()

@router.get("/stats", dependencies=[Depends(verify_superuser)])
async def get_admin_stats(db: AsyncSession = Depends(get_db)):
    """
    Returns high-level SaaS metrics for the Admin Control Tower.
    Protected: Superuser only.
    """
    mrr = await FinancialService.get_global_mrr(db)
    churn = await FinancialService.get_churn_rate(db)
    
    # Placeholder for health check integration if needed, or simple static return
    # In a real app, this might query a monitoring service
    system_health = {
        "status": "Healthy",
        "api_latency": "24ms", # Mock/Placeholder
        "database": "Online"
    }
    
    return {
        "financial": {
            "mrr": mrr,
            "churn_rate": churn,
            "growth_pct": 12.5 # Mock based on trend analysis logic (can be implemented in service)
        },
        "system": system_health,
        "security_alerts": 3 # Mock count
    }
