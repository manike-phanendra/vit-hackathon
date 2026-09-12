import uuid
from typing import Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.models.models import Payout, Policy
from app.audit.audit_trail import log_audit_event

def process_idempotent_payout(db: Session, event_id: str, policy_id: str, amount: float, actor: str = "SYSTEM") -> Dict[str, Any]:
    """
    Idempotent Payout Engine:
    Guarantees max 1 payout per trigger event using idempotency_key.
    Blocks duplicate execution requests cleanly.
    """
    idempotency_key = f"{policy_id}:{event_id}"

    # Pre-check database for duplicate payout
    existing = db.query(Payout).filter(
        (Payout.idempotency_key == idempotency_key) |
        ((Payout.policy_id == policy_id) & (Payout.event_id == event_id))
    ).first()

    if existing:
        log_audit_event(db, actor=actor, action="PAYOUT_DUPLICATE_BLOCKED", metadata={
            "policy_id": policy_id,
            "event_id": event_id,
            "idempotency_key": idempotency_key,
            "existing_payout_id": existing.payout_id
        })
        return {
            "status": "DUPLICATE_BLOCKED",
            "payout_id": existing.payout_id,
            "amount": existing.amount,
            "message": "Duplicate event processed. Additional payout attempt blocked by idempotency guard.",
            "idempotency_key": idempotency_key
        }

    payout_id = f"PAY-{uuid.uuid4().hex[:8].upper()}"
    new_payout = Payout(
        payout_id=payout_id,
        event_id=event_id,
        policy_id=policy_id,
        amount=amount,
        idempotency_key=idempotency_key,
        status="PAID"
    )

    try:
        db.add(new_payout)
        
        # Update policy status to TRIGGERED
        policy = db.query(Policy).filter(Policy.policy_id == policy_id).first()
        if policy:
            policy.status = "TRIGGERED"

        db.commit()
        db.refresh(new_payout)

        log_audit_event(db, actor=actor, action="PAYOUT_EXECUTED", metadata={
            "payout_id": payout_id,
            "policy_id": policy_id,
            "event_id": event_id,
            "amount": amount,
            "idempotency_key": idempotency_key
        })

        return {
            "status": "SUCCESS",
            "payout_id": payout_id,
            "amount": amount,
            "message": "Insurance payout executed successfully",
            "idempotency_key": idempotency_key
        }
    except IntegrityError:
        db.rollback()
        log_audit_event(db, actor=actor, action="PAYOUT_INTEGRITY_DUPLICATE", metadata={
            "policy_id": policy_id,
            "event_id": event_id
        })
        return {
            "status": "DUPLICATE_BLOCKED",
            "message": "Database constraint blocked duplicate payout attempt.",
            "idempotency_key": idempotency_key
        }
