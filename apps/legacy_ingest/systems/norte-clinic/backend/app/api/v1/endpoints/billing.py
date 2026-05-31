from typing import Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime, timedelta

from app.api import deps
from app.models.user import User
from app.models.subscription import Plan, Subscription
from app.schemas import billing as schemas

router = APIRouter()

# --- Plans (Public/Admin) ---
@router.get("/plans", response_model=list[schemas.Plan])
async def read_plans(
    db: AsyncSession = Depends(deps.get_db),
) -> Any:
    """
    Get all active plans.
    """
    result = await db.execute(select(Plan).where(Plan.is_active == True))
    return result.scalars().all()

@router.post("/plans", response_model=schemas.Plan)
async def create_plan(
    plan_in: schemas.PlanCreate,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db),
) -> Any:
    """
    Create a new plan (Admin only).
    """
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    plan = Plan(**plan_in.dict())
    db.add(plan)
    await db.commit()
    await db.refresh(plan)
    return plan

# --- Subscriptions ---
@router.get("/my-subscription", response_model=schemas.Subscription | None)
async def read_my_subscription(
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db),
) -> Any:
    """
    Get current user's subscription.
    """
    result = await db.execute(select(Subscription).where(Subscription.user_id == current_user.id))
    # Return the most recent/active one
    sub = result.scalars().first() 
    return sub

@router.post("/subscribe", response_model=schemas.Subscription)
async def create_subscription(
    sub_in: schemas.SubscriptionCreate,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db),
) -> Any:
    """
    Subscribe to a plan (Mock Implementation).
    """
    # 1. Verify Plan
    result = await db.execute(select(Plan).where(Plan.id == sub_in.plan_id))
    plan = result.scalar_one_or_none()
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")
    
    # 2. Check if already subscribed
    existing_result = await db.execute(select(Subscription).where(Subscription.user_id == current_user.id))
    existing = existing_result.scalars().first()
    
    if existing:
        # Update existing
        existing.plan_id = plan.id
        existing.current_period_end = datetime.utcnow() + timedelta(days=30)
        existing.status = "active"
        db.add(existing)
        await db.commit()
        await db.refresh(existing)
        return existing
    
    # 3. Create new
    new_sub = Subscription(
        user_id=current_user.id,
        plan_id=plan.id,
        current_period_end=datetime.utcnow() + timedelta(days=30),
        status="active"
    )
    db.add(new_sub)
    await db.commit()
    await db.refresh(new_sub)
    return new_sub
