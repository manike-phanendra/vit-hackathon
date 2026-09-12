from typing import Dict, Any, List
from app.engines.oracle import evaluate_multi_oracle_consensus

def evaluate_policy_trigger(product_data: Dict[str, Any], rainfall_readings: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Deterministic Rule Engine:
    - Evaluates consensus rainfall against product threshold.
    - AI Explains. Rules Decide.
    """
    station_id = rainfall_readings[0].get("station_id", "ST-001") if rainfall_readings else "ST-001"
    min_oracles = product_data.get("min_oracles", 2)
    threshold = float(product_data.get("rainfall_threshold", 40.0))

    oracle_eval = evaluate_multi_oracle_consensus(station_id, rainfall_readings, min_oracles=min_oracles)

    if oracle_eval["status"] == "REVIEW":
        return {
            "status": "REVIEW",
            "consensus_rainfall": oracle_eval["consensus_mm"],
            "threshold": threshold,
            "rule_name": f"Rainfall < {threshold} mm",
            "reason": oracle_eval["reason"],
            "oracle_eval": oracle_eval
        }

    consensus = oracle_eval["consensus_mm"]

    if consensus < threshold:
        return {
            "status": "TRIGGERED",
            "consensus_rainfall": consensus,
            "threshold": threshold,
            "rule_name": f"Rainfall < {threshold} mm",
            "reason": f"Observed rainfall ({consensus} mm) is below trigger threshold ({threshold} mm)",
            "oracle_eval": oracle_eval
        }

    return {
        "status": "NO_TRIGGER",
        "consensus_rainfall": consensus,
        "threshold": threshold,
        "rule_name": f"Rainfall < {threshold} mm",
        "reason": f"Observed rainfall ({consensus} mm) meets or exceeds trigger threshold ({threshold} mm)",
        "oracle_eval": oracle_eval
    }
