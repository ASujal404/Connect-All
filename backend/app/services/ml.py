import numpy as np
from typing import Dict
from sklearn.ensemble import RandomForestRegressor

FEATURE_ORDER = [
    "avg_elevation",
    "terrain_variance",
    "slope_mean",
    "pop_density",
    "pop_growth",
    "avg_rainfall",
    "storm_frequency",
    "temperature_variance",
    "tower_density",
    "avg_uptime",
    "backhaul_redundancy",
    "region_area_sq_km",
]

class RiskModel:
    def __init__(self):
        self.model = RandomForestRegressor(
            n_estimators=50,
            max_depth=6,
            random_state=42
        )
        self._train_mock_model()

    def _train_mock_model(self):
        """
        Train on synthetic data representing
        low-risk to high-risk rural regions.
        """
        X = np.array([
            # Stable regions
            [200, 0.2, 5, 200, 1.5, 700, 1, 5, 5, 0.98, 0.8, 12],
            [100, 0.1, 3, 300, 2.0, 500, 1, 4, 6, 0.99, 0.9, 8],

            # Moderate risk
            [600, 0.5, 15, 80, 0.8, 1000, 3, 8, 2, 0.90, 0.3, 15],

            # High risk
            [1200, 0.8, 30, 30, 0.2, 1500, 6, 12, 1, 0.80, 0.1, 20],
            [900, 0.7, 25, 40, 0.3, 1400, 5, 10, 1, 0.82, 0.2, 18],
        ])

        y = np.array([10, 8, 45, 85, 78])

        self.model.fit(X, y)

    def predict(self, features: Dict[str, float]) -> Dict:
        x = np.array([features[name] for name in FEATURE_ORDER]).reshape(1, -1)

        risk_score = float(self.model.predict(x)[0])
        risk_score = max(0.0, min(100.0, risk_score))

        risk_class = "At-risk" if risk_score >= 50 else "Stable"

        importances = self.model.feature_importances_
        feature_importance = {
            FEATURE_ORDER[i]: round(float(importances[i]), 4)
            for i in range(len(FEATURE_ORDER))
        }

        return {
            "risk_score": round(risk_score, 2),
            "risk_class": risk_class,
            "feature_importance": feature_importance
        }

# Singleton instance
risk_model = RiskModel()
