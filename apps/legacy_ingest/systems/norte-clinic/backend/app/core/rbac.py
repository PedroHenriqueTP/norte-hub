from fastapi import HTTPException, status, Depends
from typing import List
from app.models.user import User

# This expects get_current_user to be available or passed
# optimizing for standard FastAPI dependency injection

def verify_superuser(current_user: User):
    if not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="The user doesn't have enough privileges (Superuser required)"
        )
    return current_user

class RoleChecker:
    def __init__(self, allowed_roles: List[str]):
        self.allowed_roles = allowed_roles

    def __call__(self, current_user: User):
        if current_user.is_superuser:
            return current_user
            
        if current_user.role not in self.allowed_roles:
             raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Operation not permitted for role '{current_user.role}'. Required: {self.allowed_roles}"
            )
        return current_user

# Usage: Depends(RoleChecker(["admin"]))
