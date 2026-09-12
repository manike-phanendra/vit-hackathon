from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import User, Policy, Payout, Product, RainfallObservation
from app.engines.oracle import evaluate_multi_oracle_consensus

router = APIRouter(prefix="/farmer", tags=["Farmer Dashboard"])

@router.get("/list")
def list_all_farmers(db: Session = Depends(get_db)):
    farmers = db.query(User).filter(User.role == "FARMER").all()
    return [{
        "user_id": f.user_id,
        "name": f.name,
        "mobile_number": f.mobile_number,
        "device_id": f.device_id
    } for f in farmers]

@router.get("/profile")
def get_farmer_profile(user_id: str = Query("USR-101"), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Farmer profile not found")
    return {
        "user_id": user.user_id,
        "name": user.name,
        "mobile_number": user.mobile_number,
        "role": user.role,
        "device_id": user.device_id
    }

@router.get("/policies")
def get_farmer_policies(user_id: str = Query("USR-101"), db: Session = Depends(get_db)):
    policies = db.query(Policy).filter(Policy.user_id == user_id).all()
    result = []
    for pol in policies:
        product = db.query(Product).filter(Product.product_id == pol.product_id).first()
        result.append({
            "policy_id": pol.policy_id,
            "crop": pol.crop,
            "premium": pol.premium,
            "coverage": pol.coverage,
            "start_date": pol.start_date,
            "end_date": pol.end_date,
            "status": pol.status,
            "product_name": product.name if product else "Crop Shield",
            "threshold_mm": product.rainfall_threshold if product else 40.0
        })
    return result

@router.get("/rainfall")
def get_farmer_rainfall(station_id: str = Query("ST-001"), db: Session = Depends(get_db)):
    observations = db.query(RainfallObservation).filter(RainfallObservation.station_id == station_id).all()
    readings = [{
        "oracle_id": obs.oracle_id,
        "station_id": obs.station_id,
        "rainfall_mm": obs.rainfall_mm,
        "quality_status": obs.quality_status
    } for obs in observations]

    if not readings:
        readings = [
            {"oracle_id": "Oracle A", "station_id": station_id, "rainfall_mm": 28.0},
            {"oracle_id": "Oracle B", "station_id": station_id, "rainfall_mm": 27.0},
            {"oracle_id": "Oracle C", "station_id": station_id, "rainfall_mm": 28.0}
        ]

    consensus_eval = evaluate_multi_oracle_consensus(station_id, readings)
    threshold = 40.0
    diff_percent = round(((threshold - consensus_eval["consensus_mm"]) / threshold) * 100, 1)

    return {
        "station_id": station_id,
        "current_rainfall_mm": consensus_eval["consensus_mm"],
        "threshold_mm": threshold,
        "diff_percent_below_threshold": max(0.0, diff_percent),
        "trigger_detected": consensus_eval["consensus_mm"] < threshold,
        "consensus_status": consensus_eval["status"],
        "confidence": consensus_eval["confidence"],
        "readings": readings
    }

@router.get("/payouts")
def get_farmer_payouts(user_id: str = Query("USR-101"), db: Session = Depends(get_db)):
    payouts = db.query(Payout).join(Policy).filter(Policy.user_id == user_id).all()
    return [{
        "payout_id": p.payout_id,
        "policy_id": p.policy_id,
        "event_id": p.event_id,
        "amount": p.amount,
        "status": p.status,
        "created_at": p.created_at.isoformat() if p.created_at else None
    } for p in payouts]
