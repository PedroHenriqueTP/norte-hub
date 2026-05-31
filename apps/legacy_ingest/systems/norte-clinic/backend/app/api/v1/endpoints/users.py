from typing import Any
from fastapi import APIRouter, Body, Depends, HTTPException
from fastapi.encoders import jsonable_encoder
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.api import deps
from app.core import security
from app.models.user import User
from app.schemas.user import User as UserSchema, UserUpdate

router = APIRouter()

@router.get("/me", response_model=UserSchema)
def read_user_me(
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get current user.
    """
    return current_user

@router.put("/me", response_model=UserSchema)
async def update_user_me(
    *,
    db: AsyncSession = Depends(deps.get_db),
    password: str = Body(None),
    full_name: str = Body(None),
    email: str = Body(None),
    profile_image: str = Body(None),
    # Extended fields disabled due to missing migration
    # crm: str = Body(None),
    # personal_phone: str = Body(None),
    # chatbot_phone: str = Body(None),
    # certificate_template: str = Body(None),
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Update own user.
    """
    current_user_data = jsonable_encoder(current_user)
    user_in = UserUpdate(**current_user_data)
    
    if password:
        user_in.password = password
    if full_name:
        user_in.full_name = full_name
    if email:
        user_in.email = email
    if profile_image:
        user_in.profile_image = profile_image

    # Logic to update user in DB
    # Note: Using AsyncSession logic similar to what we assume exists in CRUD or direct
    # For now direct update:
    
    if password:
        hashed_password = security.get_password_hash(password)
        current_user.hashed_password = hashed_password
    
    if full_name:
        current_user.full_name = full_name
    if email:
        current_user.email = email
    if profile_image:
        current_user.profile_image = profile_image
        
    # Extended fields logic commented out
    # if crm is not None:
    #     current_user.crm = crm
    # if personal_phone is not None:
    #     current_user.personal_phone = personal_phone
    # if chatbot_phone is not None:
    #     current_user.chatbot_phone = chatbot_phone
    # if certificate_template is not None:
    #     current_user.certificate_template = certificate_template

    db.add(current_user)
    await db.commit()
    await db.refresh(current_user)
    
    return current_user

@router.get("/", response_model=list[UserSchema])
async def read_users(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db),
) -> Any:
    """
    Retrieve users. Only for admins.
    """
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    result = await db.execute(select(User).offset(skip).limit(limit))
    users = result.scalars().all()
    return users

@router.patch("/{user_id}", response_model=UserSchema)
async def update_user_by_admin(
    user_id: int,
    user_update: UserUpdate,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db),
) -> Any:
    """
    Update a user by admin (e.g. change role, deactivate).
    """
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not enough permissions")
        
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    update_data = user_update.dict(exclude_unset=True)
    
    # Secure field updates
    if "password" in update_data and update_data["password"]:
         hashed_password = security.get_password_hash(update_data["password"])
         user.hashed_password = hashed_password
         del update_data["password"]

    for field, value in update_data.items():
        setattr(user, field, value)

    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user
