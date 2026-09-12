import json
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import SyncQueue
from app.schemas.schemas import BatchSyncRequest, BatchSyncResponse
from app.audit.audit_trail import log_audit_event

router = APIRouter(prefix="/sync", tags=["Offline Sync Engine"])

@router.post("", response_model=BatchSyncResponse)
def sync_offline_events(payload: BatchSyncRequest, db: Session = Depends(get_db)):
    """
    Offline Sync Engine:
    - Receives batch of queued offline events from React PWA IndexedDB
    - Performs version check and conflict resolution (server version authoritative)
    - Returns sync status and acknowledgment
    """
    synced_count = 0
    rejected_count = 0
    details = []

    for event in payload.events:
        # Conflict resolution rule: if device version < server expected version (e.g. 9-day offline stale conflict)
        server_policy_version = 5 # Example baseline server state
        if event.device_version < 3 and server_policy_version >= 5:
            rejected_count += 1
            details.append({
                "event_id": event.event_id,
                "status": "REJECTED_STALE_CONFLICT",
                "message": "Device state version is older than authoritative server policy version."
            })
            log_audit_event(db, actor=payload.user_id, action="SYNC_STALE_CONFLICT_REJECTED", metadata={
                "event_id": event.event_id, "device_version": event.device_version
            })
            continue

        queue_item = SyncQueue(
            sync_id=event.event_id,
            device_id=payload.device_id,
            user_id=payload.user_id,
            event_type=event.event_type,
            payload_json=json.dumps(event.payload),
            status="SYNCED"
        )
        db.add(queue_item)
        synced_count += 1
        details.append({"event_id": event.event_id, "status": "SYNCED", "message": "Event processed and synchronized successfully"})

    db.commit()

    log_audit_event(db, actor=payload.user_id, action="BATCH_SYNC_COMPLETED", metadata={
        "device_id": payload.device_id,
        "synced_count": synced_count,
        "rejected_count": rejected_count
    })

    return BatchSyncResponse(
        status="SUCCESS",
        synced_count=synced_count,
        rejected_count=rejected_count,
        details=details
    )

@router.get("/status")
def get_sync_status(device_id: str = "DEV-MOBILE-01", db: Session = Depends(get_db)):
    items = db.query(SyncQueue).filter(SyncQueue.device_id == device_id).all()
    return {
        "device_id": device_id,
        "total_queued": len(items),
        "synced": len([i for i in items if i.status == "SYNCED"]),
        "conflicts": len([i for i in items if i.status == "CONFLICT"])
    }
