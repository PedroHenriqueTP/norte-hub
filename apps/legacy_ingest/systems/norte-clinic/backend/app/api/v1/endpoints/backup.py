from typing import Any
import json
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.api import deps
from app.db.session import get_db

router = APIRouter()

@router.get("/", response_class=Response)
def create_backup(
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Create a database backup (JSON dump of major tables).
    Values are converted to strings to ensure JSON serialization.
    """
    backup_data = {
        "timestamp": datetime.now().isoformat(),
        "tables": {}
    }
    
    tables_to_backup = ["user", "patient", "appointment", "financial_transaction", "document", "consultation", "message"]
    
    for table in tables_to_backup:
        try:
            # Safe usage since table names are hardcoded
            result = db.execute(text(f"SELECT * FROM \"{table}\""))
            rows = [dict(row._mapping) for row in result]
            
            # Serialize dates and other non-JSON types
            serialized_rows = []
            for row in rows:
                new_row = {}
                for k, v in row.items():
                    if isinstance(v, datetime):
                        new_row[k] = v.isoformat()
                    else:
                        new_row[k] = str(v) if v is not None else None
                serialized_rows.append(new_row)
                
            backup_data["tables"][table] = serialized_rows
        except Exception as e:
            print(f"Skipping table {table}: {e}")
            
    json_str = json.dumps(backup_data, indent=2)
    
    filename = f"backup_medcura_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    
    return Response(
        content=json_str,
        media_type="application/json",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )
