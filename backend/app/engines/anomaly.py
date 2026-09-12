import numpy as np

class RainfallAnomalyDetector:
    def __init__(self):
        # Default baseline statistics for monsoon rainfall (mm)
        self.mean_rainfall = 30.0
        self.std_rainfall = 10.0

    def compute_anomaly_score(self, rainfall_mm: float, neighbor_readings: list = None) -> float:
        """
        Computes anomaly score between 0.0 (normal) and 1.0 (highly anomalous).
        Checks standard deviation distance and neighbor disagreement.
        """
        # Statistical z-score based anomaly calculation
        z_score = abs(rainfall_mm - self.mean_rainfall) / (self.std_rainfall + 1e-5)
        base_score = min(1.0, z_score / 4.0)

        # Neighbor discrepancy check
        if neighbor_readings and len(neighbor_readings) > 0:
            median_neighbor = float(np.median(neighbor_readings))
            diff = abs(rainfall_mm - median_neighbor)
            if diff > 15.0: # Huge variance from neighbors
                base_score = max(base_score, 0.92)

        return round(float(base_score), 3)

anomaly_detector = RainfallAnomalyDetector()
