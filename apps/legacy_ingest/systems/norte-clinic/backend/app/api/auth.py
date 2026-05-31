from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from app.crud.user import authenticate_user
from app.core.security import create_access_token, create_refresh_token
from app.db.base import get_db
from app.schemas.token import Token
from jose import jwt, JWTError
from app.core.config import settings

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/login", response_model=Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_db)
):
    # OAuth2PasswordRequestForm has username/password fields
    # We treat username as email in our system
    user = await authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(subject=user.email)
    refresh_token = create_refresh_token(subject=user.email)
    
    return {
        "access_token": access_token, 
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }

@router.post("/refresh", response_model=Token)
async def refresh_token(
    refresh_token: str,
    db: AsyncSession = Depends(get_db)
):
    """
    Generates a new access token using a valid refresh token.
    """
    try:
        payload = jwt.decode(refresh_token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email: str = payload.get("sub")
        token_type: str = payload.get("type")
        
        if email is None or token_type != "refresh":
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")
            
        # Optional: Check if user still exists or is active in DB
        # user = await get_user_by_email(db, email=email)
        # if not user: raise ...

        access_token = create_access_token(subject=email)
        # We can rotate refresh token here if we want strict security, 
        # or return the same one if it's still valid for long time.
        # For this implementation, we issue a new access token and return the SAME refresh token 
        # (or a new one if we want rotation). Let's implement rotation for better security.
        new_refresh_token = create_refresh_token(subject=email)

        return {
            "access_token": access_token, 
            "refresh_token": new_refresh_token,
            "token_type": "bearer"
        }
        
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token",
            headers={"WWW-Authenticate": "Bearer"},
        )

# 2FA Implementation
import pyotp
import qrcode
import io
import base64
from fastapi.responses import StreamingResponse
from app.api import deps # Assuming we have deps for current_user

@router.post("/2fa/setup")
async def setup_2fa(
    db: AsyncSession = Depends(get_db),
    current_user = Depends(deps.get_current_user)
):
    """
    Generates a TOTP secret and returns the QR Code (base64 or image).
    """
    if current_user.totp_secret:
         raise HTTPException(status_code=400, detail="2FA already setup. Disable it first to reset.")
    
    # Generate random secret
    secret = pyotp.random_base32()
    
    # Save secret to DB (temporarily or permanently pending verification)
    # Ideally, we store it in a temp field until verified, but for MVP we store it directly
    current_user.totp_secret = secret
    db.add(current_user)
    await db.commit()
    
    # Generate QR Code
    uri = pyotp.totp.TOTP(secret).provisioning_uri(
        name=current_user.email, 
        issuer_name=settings.PROJECT_NAME
    )
    
    # Create QR image
    img = qrcode.make(uri)
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    img_str = base64.b64encode(buf.getvalue()).decode()
    
    return {
        "secret": secret,
        "qr_code_base64": img_str,
        "uri": uri
    }

@router.post("/2fa/verify")
async def verify_2fa(
    code: str,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(deps.get_current_user)
):
    """
    Verifies the TOTP code provided by the user.
    """
    if not current_user.totp_secret:
        raise HTTPException(status_code=400, detail="2FA not setup.")
        
    totp = pyotp.TOTP(current_user.totp_secret)
    if totp.verify(code):
        # Here we could set a flag 'is_2fa_verified' in the token or user session
        # For MVP, we simply return success
        return {"message": "2FA verified successfully", "valid": True}
    
    raise HTTPException(status_code=401, detail="Invalid 2FA code")
