import pytest
from app.engines.trigger import evaluate_policy_trigger

def test_trigger_fires_below_threshold():
    product = {"rainfall_threshold": 40.0, "min_oracles": 2}
    readings = [
        {"oracle_id": "Oracle A", "station_id": "ST-001", "rainfall_mm": 28.0},
        {"oracle_id": "Oracle B", "station_id": "ST-001", "rainfall_mm": 27.0},
        {"oracle_id": "Oracle C", "station_id": "ST-001", "rainfall_mm": 28.0}
    ]
    res = evaluate_policy_trigger(product, readings)
    assert res["status"] == "TRIGGERED"
    assert res["consensus_rainfall"] == 28.0

def test_no_trigger_above_threshold():
    product = {"rainfall_threshold": 40.0, "min_oracles": 2}
    readings = [
        {"oracle_id": "Oracle A", "station_id": "ST-001", "rainfall_mm": 42.0},
        {"oracle_id": "Oracle B", "station_id": "ST-001", "rainfall_mm": 45.0},
        {"oracle_id": "Oracle C", "station_id": "ST-001", "rainfall_mm": 42.0}
    ]
    res = evaluate_policy_trigger(product, readings)
    assert res["status"] == "NO_TRIGGER"
    assert res["consensus_rainfall"] == 42.0
