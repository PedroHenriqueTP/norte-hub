import httpx
import logging
from app.core.config import settings

logger = logging.getLogger(__name__)

class MetaWhatsAppService:
    BASE_URL = "https://graph.facebook.com/v17.0"

    def __init__(self):
        self.access_token = settings.META_ACCESS_TOKEN
        self.phone_number_id = settings.META_PHONE_NUMBER_ID
        
        if not self.access_token or not self.phone_number_id:
            logger.warning("Meta API credentials not set. WhatsApp features will operate in MOCK mode.")

    async def send_message(self, to_number: str, text_body: str):
        """
        Sends a text message via WhatsApp Cloud API.
        """
        if not self.access_token or not self.phone_number_id:
            logger.info(f"[MOCK META API] Sending to {to_number}: {text_body}")
            return {"status": "mock_sent"}

        url = f"{self.BASE_URL}/{self.phone_number_id}/messages"
        headers = {
            "Authorization": f"Bearer {self.access_token}",
            "Content-Type": "application/json",
        }
        payload = {
            "messaging_product": "whatsapp",
            "to": to_number,
            "type": "text",
            "text": {"body": text_body},
        }

        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(url, headers=headers, json=payload)
                response.raise_for_status()
                return response.json()
            except httpx.HTTPStatusError as e:
                logger.error(f"Meta API Error: {e.response.text}")
                raise e
            except Exception as e:
                logger.error(f"Failed to send WhatsApp message: {e}")
                raise e

meta_service = MetaWhatsAppService()
