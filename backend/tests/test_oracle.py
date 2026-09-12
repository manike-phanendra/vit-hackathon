import pytest
from app.engines.oracle import evaluate_multi_oracle_consensus

def test_oracle_median_consensus():
    readings = [
        {"oracle_id": "Oracle A", "station_id": "ST-001", "rainfall_mm": 28.0},
        {"oracle_id": "Oracle B", "station_id": "ST-001", "rainfall_mm": 27.0},
        {"oracle_id": "Oracle C", "station_id": "ST-001", "rainfall_mm": 28.0}
    ]
    res = evaluate_multi_oracle_consensus("ST-001", readings)
    assert res["status"] == "HEALTHY"
    assert res["consensus_mm"] == 28.0
    assert len(res["valid_oracles"]) == 3

def test_oracle_anomalous_source_rejection():
    readings = [
        {"oracle_id": "Oracle A", "station_id": "ST-001", "rainfall_mm": 5.0},  # Anomalous outlier
        {"oracle_id": "Oracle B", "station_id": "ST-001", "rainfall_mm": 32.0},
        {"oracle_id": "Oracle C", "station_id": "ST-001", "rainfall_mm": 31.0}
    ]
    res = evaluate_multi_oracle_consensus("ST-001", readings)
    assert len(res["flagged_oracles"]) >= 1
    assert res["flagged_oracles"][0]["oracle_id"] == "Oracle A"
    assert res["consensus_mm"] == 31.5 # Median of 31.0 and 32.0
