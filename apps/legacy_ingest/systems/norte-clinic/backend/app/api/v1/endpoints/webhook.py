from fastapi import APIRouter, Request, Query, HTTPException, Response, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.message import Message
from app.core.config import settings
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

@router.get("/webhook")
async def verify_webhook(
    mode: str = Query(..., alias="hub.mode"),
    verify_token: str = Query(..., alias="hub.verify_token"),
    challenge: str = Query(..., alias="hub.challenge"),
):
    """
    Handle Meta's Webhook Verification Challenge.
    """
    if mode == "subscribe" and verify_token == settings.META_VERIFY_TOKEN:
        logger.info("Webhook verified successfully!")
        return Response(content=challenge, media_type="text/plain")
    
    raise HTTPException(status_code=403, detail="Verification failed")

@router.post("/webhook")
async def receive_webhook(request: Request, db: Session = Depends(get_db)):
    """
    Receive incoming messages from WhatsApp.
    """
    body = await request.json()
    
    # Check if this is a WhatsApp status update or message
    try:
        entry = body.get("entry", [])[0]
        changes = entry.get("changes", [])[0]
        value = changes.get("value", {})
        
        if "messages" in value:
            messages = value["messages"]
            for msg in messages:
                if msg["type"] == "text":
                    sender = msg["from"]
                    text = msg["text"]["body"]
                    logger.info(f"Received WhatsApp message from {sender}: {text}")
                    
                    # Save to DB
                    db_msg = Message(patient_phone=sender, content=text, source="user")
                    db.add(db_msg)
                    db.commit()
                    
                    # Push to Frontend via WebSocket
                    from app.api.v1.endpoints.chat import manager
                    # Broadcast detailed JSON so frontend can display correctly
                    await manager.broadcast(f"NEW_MESSAGE|{sender}|{text}")
                    
        return {"status": "ok"}
    except Exception as e:
        logger.error(f"Error processing webhook: {e}")
        # Return 200 to prevent Meta from retrying infinitely on malformed payloads
        return {"status": "error", "detail": str(e)}
