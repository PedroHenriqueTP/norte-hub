from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, text
from app.models.subscription import Subscription
from app.models.financial import Invoice
from datetime import datetime, timedelta

class FinancialService:
    @staticmethod
    async def get_global_mrr(db: AsyncSession) -> float:
        """
        Calculates Global MRR based on active subscriptions.
        Assumes 'price' is monthly. If yearly, divides by 12.
        """
        stmt = select(func.sum(Subscription.price)).where(
            Subscription.is_active == True,
            Subscription.status == 'active'
        )
        result = await db.execute(stmt)
        mrr = result.scalar() or 0.0
        return float(mrr)

    @staticmethod
    async def get_churn_rate(db: AsyncSession, days: int = 30) -> float:
        """
        Calculates Churn Rate over the last N days.
        Formula: (Cancelled Subs in Period / Total Active at Start) * 100
        """
        cutoff_date = datetime.utcnow() - timedelta(days=days)
        
        # Count cancelled in period
        cancelled_stmt = select(func.count(Subscription.id)).where(
            Subscription.status == 'cancelled',
            Subscription.updated_at >= cutoff_date
        )
        cancelled_count = (await db.execute(cancelled_stmt)).scalar() or 0
        
        # Count active now
        active_stmt = select(func.count(Subscription.id)).where(
            Subscription.status == 'active'
        )
        active_count = (await db.execute(active_stmt)).scalar() or 0
        
        # Total at start approx = active + cancelled
        start_count = active_count + cancelled_count
        
        if start_count == 0:
            return 0.0
            
        return (cancelled_count / start_count) * 100

    @staticmethod
    async def get_recent_transactions(db: AsyncSession, limit: int = 5):
        stmt = select(Invoice).order_by(Invoice.issue_date.desc()).limit(limit)
        result = await db.execute(stmt)
        return result.scalars().all()
