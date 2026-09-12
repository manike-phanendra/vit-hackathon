from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import RainfallObservation
from app.engines.oracle import evaluate_multi_oracle_consensus

router = APIRouter(prefix="/oracles", tags=["Field / Oracle Data"])

@router.get("/health")
def get_oracle_health(db: Session = Depends(get_db)):
    readings = [
        {"oracle_id": "Oracle A", "station_id": "ST-001", "rainfall_mm": 28.0, "status": "Healthy"},
        {"oracle_id": "Oracle B", "station_id": "ST-001", "rainfall_mm": 27.0, "status": "Healthy"},
        {"oracle_id": "Oracle C", "station_id": "ST-001", "rainfall_mm": 28.0, "status": "Delayed"}
    ]
    eval_res = evaluate_multi_oracle_consensus("ST-001", readings)

    return {
        "station_id": "ST-001",
        "oracles": [
            {"name": "Oracle A", "rainfall": 28.0, "status": "Healthy", "latency": "120ms"},
            {"name": "Oracle B", "rainfall": 27.0, "status": "Healthy", "latency": "180ms"},
            {"name": "Oracle C", "rainfall": 28.0, "status": "Delayed", "latency": "4200ms"}
        ],
        "consensus_mm": eval_res["consensus_mm"],
        "confidence": eval_res["confidence"],
        "agreement_status": "CONVERGED" if eval_res["confidence"] == "HIGH" else "DISAGREEMENT"
    }

@router.get("/stations")
def list_weather_stations():
    return [
        {"station_id": "ST-001", "location": "Warangal", "rainfall_mm": 28.0, "status": "Healthy", "last_update": "2 min ago"},
        {"station_id": "ST-002", "location": "Karimnagar", "rainfall_mm": 27.0, "status": "Healthy", "last_update": "3 min ago"},
        {"station_id": "ST-003", "location": "Nalgonda", "rainfall_mm": 28.0, "status": "Delayed", "last_update": "8 min ago"}
    ]
