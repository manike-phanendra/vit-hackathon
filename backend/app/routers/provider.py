from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models.models import Policy, Payout, Product

router = APIRouter(prefix="/provider", tags=["Provider Dashboard"])

@router.get("/metrics")
def get_provider_metrics(db: Session = Depends(get_db)):
    total_policies = db.query(func.count(Policy.policy_id)).scalar() or 0
    active_policies = db.query(func.count(Policy.policy_id)).filter(Policy.status == "ACTIVE").scalar() or 0
    triggered_policies = db.query(func.count(Policy.policy_id)).filter(Policy.status == "TRIGGERED").scalar() or 0

    total_premium = db.query(func.sum(Policy.premium)).scalar() or 0.0
    total_coverage = db.query(func.sum(Policy.coverage)).scalar() or 0.0
    total_payouts = db.query(func.sum(Payout.amount)).filter(Payout.status == "PAID").scalar() or 0.0

    return {
        "total_policies": total_policies,
        "active_policies": active_policies,
        "triggered_policies": triggered_policies,
        "total_premium_collected": total_premium,
        "total_coverage_amount": total_coverage,
        "total_payouts_disbursed": total_payouts
    }

@router.get("/crop-distribution")
def get_crop_distribution(db: Session = Depends(get_db)):
    results = db.query(Policy.crop, func.count(Policy.policy_id)).group_by(Policy.crop).all()
    if not results:
        return [
            {"crop": "Paddy", "count": 6420},
            {"crop": "Cotton", "count": 3210},
            {"crop": "Groundnut", "count": 1850},
            {"crop": "Chilli", "count": 1060}
        ]
    return [{"crop": r[0], "count": r[1]} for r in results]

@router.get("/monthly-premiums")
def get_monthly_premiums():
    return [
        {"month": "May", "premium": 4.2},
        {"month": "Jun", "premium": 8.5},
        {"month": "Jul", "premium": 11.4},
        {"month": "Aug", "premium": 8.3}
    ]

@router.get("/trigger-exposure")
def get_trigger_exposure():
    return {
        "low_risk": 8200,
        "medium_risk": 3100,
        "high_risk": 1240
    }

@router.get("/map-data")
def get_map_data():
    return [
        {"id": "ST-001", "name": "Warangal Central", "lat": 17.9784, "lng": 79.5941, "rainfall": 28.0, "status": "TRIGGERED", "policies_affected": 420},
        {"id": "ST-002", "name": "Karimnagar North", "lat": 18.4386, "lng": 79.1288, "rainfall": 42.0, "status": "HEALTHY", "policies_affected": 0},
        {"id": "ST-003", "name": "Nalgonda East", "lat": 17.0577, "lng": 79.2684, "rainfall": 18.0, "status": "TRIGGERED", "policies_affected": 680},
        {"id": "ST-004", "name": "Khammam South", "lat": 17.2473, "lng": 80.1514, "rainfall": 35.0, "status": "HEALTHY", "policies_affected": 0}
    ]
