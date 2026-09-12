import numpy as np
from typing import List, Dict, Any
from app.engines.anomaly import anomaly_detector

def evaluate_multi_oracle_consensus(station_id: str, readings: List[Dict[str, Any]], min_oracles: int = 2) -> Dict[str, Any]:
    """
    Multi-Oracle Consensus Engine:
    - Filters anomalous or stale sources
    - Calculates median consensus
    - Determines confidence level & review requirement
    """
    valid_readings = []
    flagged_readings = []
    raw_values = [r["rainfall_mm"] for r in readings if "rainfall_mm" in r]

    for item in readings:
        oracle_id = item.get("oracle_id", "UNKNOWN")
        val = float(item.get("rainfall_mm", 0.0))
        is_stale = item.get("is_stale", False)

        # Other readings excluding current for neighbor check
        neighbors = [v for v in raw_values if v != val]
        score = anomaly_detector.compute_anomaly_score(val, neighbor_readings=neighbors)

        if is_stale:
            flagged_readings.append({
                "oracle_id": oracle_id,
                "rainfall_mm": val,
                "reason": "Source data stale",
                "anomaly_score": score
            })
        elif score > 0.85:
            flagged_readings.append({
                "oracle_id": oracle_id,
                "rainfall_mm": val,
                "reason": "Anomalous reading rejected",
                "anomaly_score": score
            })
        else:
            valid_readings.append({
                "oracle_id": oracle_id,
                "rainfall_mm": val,
                "anomaly_score": score
            })

    # Quorum check
    if len(valid_readings) < min_oracles:
        return {
            "station_id": station_id,
            "consensus_mm": float(np.median([r["rainfall_mm"] for r in readings])) if readings else 0.0,
            "status": "REVIEW",
            "reason": f"Insufficient valid oracle quorum ({len(valid_readings)}/{min_oracles})",
            "confidence": "LOW",
            "valid_oracles": [r["oracle_id"] for r in valid_readings],
            "flagged_oracles": flagged_readings,
            "all_readings": readings
        }

    # High disagreement check (e.g. 18mm vs 42mm)
    valid_vals = [r["rainfall_mm"] for r in valid_readings]
    if max(valid_vals) - min(valid_vals) > 20.0:
        return {
            "station_id": station_id,
            "consensus_mm": float(np.median(valid_vals)),
            "status": "REVIEW",
            "reason": "Extreme oracle source disagreement detected (>20mm variance)",
            "confidence": "MEDIUM",
            "valid_oracles": [r["oracle_id"] for r in valid_readings],
            "flagged_oracles": flagged_readings,
            "all_readings": readings
        }

    # Normal consensus using median
    consensus = float(np.median(valid_vals))
    return {
        "station_id": station_id,
        "consensus_mm": round(consensus, 2),
        "status": "HEALTHY",
        "reason": "Multi-oracle consensus established successfully",
        "confidence": "HIGH",
        "valid_oracles": [r["oracle_id"] for r in valid_readings],
        "flagged_oracles": flagged_readings,
        "all_readings": readings
    }
