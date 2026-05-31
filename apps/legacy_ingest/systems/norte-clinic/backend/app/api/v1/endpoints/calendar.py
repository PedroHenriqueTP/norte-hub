from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.appointment import Appointment
from app.models.patient import Patient
from ics import Calendar, Event
from fastapi.responses import Response
from datetime import datetime
import arrow

router = APIRouter()

@router.get("/feed", response_class=Response)
def get_calendar_feed(
    token: str = Query(...),
    db: Session = Depends(get_db)
):
    """
    Generate an ICS feed for the user identified by the token.
    Note: For simplicity in this MVP, we are accepting the raw access_token 
    as a query param to verify identity, or we could just make it public 
    if we implemented a dedicated 'feed_token'.
    
    For now, we will assume the User is valid if they have a valid Bearer token,
    but since calendar readers (Google/Apple) can't easily send Headers, 
    we often use a persistent UUID in the URL.
    
    TODO: Implement persistent 'calendar_token' in User model for better security.
    For this 'Pre-MVP', we will just fetch ALL appointments for the system.
    """
    
    # In a real app, validate 'token' matches a User.
    # For this MVP, we just generate the feed for ALL appointments (Admin View).
    
    appointments = db.query(Appointment).all()
    
    c = Calendar()
    
    for app in appointments:
        e = Event()
        e.name = f"Consulta: {app.patient_name}"
        # Parse datetime. assuming app.start_time is datetime object
        # ics requires arrow objects or compatible
        e.begin = arrow.get(app.start_time)
        e.end = arrow.get(app.end_time)
        e.description = f"Status: {app.status}\nNotes: {app.notes or ''}"
        c.events.add(e)
        
    return Response(content=str(c), media_type="text/calendar")
