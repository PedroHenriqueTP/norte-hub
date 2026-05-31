from datetime import datetime, timedelta
from typing import Any, Union, Optional
from jose import jwt
from passlib.context import CryptContext
from app.core.config import settings

# Explicit schemes for stability
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

ALGORITHM = "HS256"

def create_access_token(subject: Union[str, Any], expires_delta: timedelta = None) -> str:
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode = {"exp": expire, "sub": str(subject)}
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def create_refresh_token(subject: Union[str, Any], expires_delta: timedelta = None) -> str:
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS) # Defined in config or default 7
    
    to_encode = {"exp": expire, "sub": str(subject), "type": "refresh"}
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifica se a senha plain corresponde ao hash"""
    try:
        # Tenta verificar a senha
        # Se a senha for muito longa (>72 bytes) o passlib/bcrypt pode reclamar, 
        # mas aqui a verificacao geralmente trunca internamente ou lida com isso se configurado.
        # Mas para garantir consistencia com o hash, truncamos a entrada tambem se necessario
        # (Depende da versao do passlib, mas truncar aqui nao machuca se o hash foi gerado truncado)
        return pwd_context.verify(plain_password[:72], hashed_password)
    except Exception:
        return False

def get_password_hash(password: str) -> str:
    """Gera hash da senha usando bcrypt (limitado a 72 bytes)"""
    # BCrypt tem limite de 72 bytes. Truncamos explicitamente para evitar ValueError
    return pwd_context.hash(password[:72])
