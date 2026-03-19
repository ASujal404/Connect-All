from typing import Dict, List
from copy import deepcopy
from app.services.ml import risk_model

def simulate_scenarios(
    base_features: Dict[str, float],
    base_risk_score: float
) -> List[Dict]:
    results = []

    scenarios = {
        "Extreme Weather Spike": {
            "avg_rainfall": 1.3,
            "storm_frequency": 1.5
        },
        "Load Surge": {
            "pop_density": 1.4,
            "avg_uptime": 0.85
        },
        "Relay Failure": {
            "tower_density": 0.6,
            "backhaul_redundancy": 0.5
        }
    }

    for name, modifiers in scenarios.items():
        modified = deepcopy(base_features)

        for feature, factor in modifiers.items():
            modified[feature] *= factor

        prediction = risk_model.predict(modified)

        results.append({
            "scenario_name": name,
            "adjusted_risk_score": prediction["risk_score"],
            "delta": round(
                prediction["risk_score"] - base_risk_score,
                2
            ),
            "contributing_factors": modifiers
        })

    return results
