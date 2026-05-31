from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func
from pydantic import BaseModel
from typing import List

from app.db.base import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.financial import Invoice

router = APIRouter(prefix="/financial", tags=["financial"])

class FinancialStats(BaseModel):
    monthlyTotal: float
    variation: float
    # receipts: List[str] # placeholder

@router.get("/stats", response_model=FinancialStats)
async def get_financial_stats(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Mocked calculation logic for now as we don't have enough data
    # In real world: query Invoice where date is current month, sum value
    
    # query = select(func.sum(Invoice.amount)).where(extract('month', Invoice.date) == current_month)
    # result = await db.execute(query)
    # total = result.scalar() or 0
    
    return FinancialStats(
        monthlyTotal=12500.00, # Mocked
        variation=12.5
    )
