from fastapi import APIRouter, Request, HTTPException, Query, Depends
from pydantic import BaseModel
from typing import Optional
from app.core.config import settings

# Mock HTTPX for now or import it if installed. Pydantic settings might lack these fields if not added.
# Assuming standard logging for now.

router = APIRouter(prefix="/whatsapp", tags=["whatsapp"])

VERIFY_TOKEN = settings.META_VERIFY_TOKEN or "medcura_secret"

class MessageRequest(BaseModel):
    to: str
    text: str

@router.get("/webhook")
async def verify_webhook(
    hub_mode: str = Query(None, alias="hub.mode"),
    hub_challenge: str = Query(None, alias="hub.challenge"),
    hub_verify_token: str = Query(None, alias="hub.verify_token")
):
    if hub_mode == "subscribe" and hub_verify_token == VERIFY_TOKEN:
        return int(hub_challenge)
    raise HTTPException(status_code=403, detail="Invalid verification token")

@router.post("/webhook")
async def receive_message(request: Request):
    try:
        body = await request.json()
        print("WEBHOOK RECEIVED:", body)
        # Logic to extract message, find user, save to DB
        # if "messages" in body...
        return {"status": "ok"}
    except Exception as e:
         print("Webhook Error:", e)
         # Return 200 to Meta anyway to prevent retries spam
         return {"status": "ok"}

@router.post("/send")
async def send_message(data: MessageRequest):
    # Integration with Meta API would go here
    # url = f"https://graph.facebook.com/v20.0/{settings.META_PHONE_NUMBER_ID}/messages"
    # payload = ...
    # await client.post(...)
    
    print(f"MOCK SENDING WHATSAPP to {data.to}: {data.text}")
    return {"status": "sent", "details": data}
