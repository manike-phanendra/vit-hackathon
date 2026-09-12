import hashlib
import json
from datetime import datetime
from sqlalchemy.orm import Session
from app.models.models import AuditLog

GENESIS_HASH = "0" * 64

def log_audit_event(db: Session, actor: str, action: str, metadata: dict = None) -> AuditLog:
    metadata = metadata or {}
    timestamp = datetime.utcnow().isoformat()
    
    # Get last audit record for chaining
    last_log = db.query(AuditLog).order_by(AuditLog.log_id.desc()).first()
    previous_hash = last_log.event_hash if last_log else GENESIS_HASH

    # Compute SHA-256 hash chaining
    payload_str = f"{previous_hash}|{actor}|{action}|{timestamp}|{json.dumps(metadata, sort_keys=True)}"
    event_hash = hashlib.sha256(payload_str.encode("utf-8")).hexdigest()

    log_entry = AuditLog(
        actor=actor,
        action=action,
        timestamp=timestamp,
        event_hash=event_hash,
        previous_hash=previous_hash,
        metadata_json=json.dumps(metadata)
    )

    db.add(log_entry)
    db.commit()
    db.refresh(log_entry)
    return log_entry
