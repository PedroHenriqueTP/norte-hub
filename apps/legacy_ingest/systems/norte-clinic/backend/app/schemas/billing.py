from typing import Optional
from datetime import datetime
from pydantic import BaseModel

# Plan Schemas
class PlanBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    interval: str = "month"
    features: Optional[str] = None

class PlanCreate(PlanBase):
    pass

class Plan(PlanBase):
    id: int
    is_active: bool

    class Config:
        from_attributes = True

# Subscription Schemas
class SubscriptionBase(BaseModel):
    plan_id: int

class SubscriptionCreate(SubscriptionBase):
    pass

class Subscription(SubscriptionBase):
    id: int
    user_id: int
    status: str
    current_period_end: datetime
    plan: Plan

    class Config:
        from_attributes = True
