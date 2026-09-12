import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import Policy, Product, TriggerEvent
from app.schemas.schemas import TriggerEvaluationRequest, TriggerEvaluationResponse
from app.engines.trigger import evaluate_policy_trigger
from app.engines.eligibility import verify_payout_eligibility
from app.engines.payout import process_idempotent_payout
from app.audit.audit_trail import log_audit_event

router = APIRouter(prefix="/triggers", tags=["Trigger Engine"])

@router.post("/evaluate", response_model=TriggerEvaluationResponse)
def evaluate_trigger(payload: TriggerEvaluationRequest, db: Session = Depends(get_db)):
    policy = db.query(Policy).filter(Policy.policy_id == payload.policy_id).first()
    if not policy:
        raise HTTPException(status_code=404, detail="Policy not found")

    product = db.query(Product).filter(Product.product_id == policy.product_id).first()
    product_dict = {
        "min_oracles": product.min_oracles if product else 2,
        "rainfall_threshold": product.rainfall_threshold if product else 40.0,
        "payout_amount": product.payout_amount if product else policy.coverage
    }

    readings = [r.dict() for r in payload.rainfall_readings]
    eval_res = evaluate_policy_trigger(product_dict, readings)

    event_id = f"EVT-{uuid.uuid4().hex[:8].upper()}"

    trigger_entry = TriggerEvent(
        event_id=event_id,
        policy_id=policy.policy_id,
        rule_name=eval_res["rule_name"],
        consensus_rainfall=eval_res["consensus_rainfall"],
        threshold=eval_res["threshold"],
        status=eval_res["status"],
        reason=eval_res["reason"]
    )
    db.add(trigger_entry)
    db.commit()

    log_audit_event(db, actor="SYSTEM", action="TRIGGER_EVALUATED", metadata={
        "event_id": event_id,
        "policy_id": policy.policy_id,
        "status": eval_res["status"],
        "consensus": eval_res["consensus_rainfall"]
    })

    payout_status = None
    payout_amount = None

    if eval_res["status"] == "TRIGGERED":
        # Run Eligibility Engine
        elig = verify_payout_eligibility(db, policy.policy_id, eval_res)
        if elig["eligible"]:
            # Run Idempotent Payout Engine
            payout_res = process_idempotent_payout(
                db, event_id=event_id, policy_id=policy.policy_id, amount=elig["payout_amount"]
            )
            payout_status = payout_res["status"]
            payout_amount = payout_res["amount"]
        else:
            payout_status = "REJECTED_ELIGIBILITY"
            log_audit_event(db, actor="SYSTEM", action="PAYOUT_ELIGIBILITY_REJECTED", metadata={
                "event_id": event_id, "reason": elig["reason"]
            })

    return TriggerEvaluationResponse(
        event_id=event_id,
        policy_id=policy.policy_id,
        consensus_rainfall=eval_res["consensus_rainfall"],
        threshold=eval_res["threshold"],
        status=eval_res["status"],
        reason=eval_res["reason"],
        payout_status=payout_status,
        payout_amount=payout_amount
    )

@router.get("")
def list_trigger_events(db: Session = Depends(get_db)):
    events = db.query(TriggerEvent).order_by(TriggerEvent.created_at.desc()).all()
    return events
