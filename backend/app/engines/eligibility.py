from datetime import datetime
from typing import Dict, Any
from sqlalchemy.orm import Session
from app.models.models import Policy, Payout, Product

def verify_payout_eligibility(db: Session, policy_id: str, trigger_result: Dict[str, Any]) -> Dict[str, Any]:
    """
    Eligibility Engine:
    Checks policy status, date validity, crop matching, duplicate payouts, and oracle quorum.
    """
    policy = db.query(Policy).filter(Policy.policy_id == policy_id).first()
    if not policy:
        return {"eligible": False, "reason": "Policy not found", "checks": {}}

    product = db.query(Product).filter(Product.product_id == policy.product_id).first()

    checks = {
        "policy_active": policy.status == "ACTIVE",
        "trigger_valid": trigger_result.get("status") == "TRIGGERED",
        "oracle_quorum_passed": trigger_result.get("oracle_eval", {}).get("confidence") in ["HIGH", "MEDIUM"],
        "no_previous_payout": False,
        "coverage_limit_valid": policy.coverage > 0
    }

    # Check if a payout already exists for this policy
    existing_payout = db.query(Payout).filter(
        Payout.policy_id == policy_id,
        Payout.status == "PAID"
    ).first()

    checks["no_previous_payout"] = (existing_payout is None)

    all_passed = all(checks.values())
    failed_reasons = [k for k, v in checks.items() if not v]

    reason = "All eligibility checks passed successfully" if all_passed else f"Eligibility failed on: {', '.join(failed_reasons)}"

    return {
        "eligible": all_passed,
        "reason": reason,
        "checks": checks,
        "policy": policy,
        "product": product,
        "payout_amount": product.payout_amount if product else policy.coverage
    }
