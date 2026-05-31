from fastapi import APIRouter, File, UploadFile, HTTPException, Depends
from typing import Any
import shutil
import os
from datetime import datetime
from app.api import deps
from app.models.user import User

router = APIRouter()

UPLOAD_DIR = "static/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/profile-image", response_model=dict)
async def upload_profile_image(
    file: UploadFile = File(...),
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Upload a profile image and return the URL.
    """
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    # Create unique filename
    timestamp = int(datetime.now().timestamp())
    filename = f"user_{current_user.id}_{timestamp}_{file.filename}"
    file_path = os.path.join(UPLOAD_DIR, filename)
    
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        file_url = f"/{UPLOAD_DIR}/{filename}"
        return {"url": file_url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not save file: {str(e)}")
