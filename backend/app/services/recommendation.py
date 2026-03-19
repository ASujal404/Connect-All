from typing import List, Dict

def generate_recommendations(
    risk: Dict,
    scenarios: List[Dict],
    features: Dict[str, float]
) -> List[Dict]:

    recommendations = []

    risk_score = risk["risk_score"]

    # Rule 1: High overall risk
    if risk_score >= 60:
        recommendations.append({
            "action": "Deploy satellite backup links",
            "rationale": "High predicted connectivity failure risk under baseline conditions",
            "priority": "High"
        })

    # Rule 2: Weather sensitivity
    for s in scenarios:
        if s["scenario_name"] == "Extreme Weather Spike" and s["delta"] >= 10:
            recommendations.append({
                "action": "Add weather-resilient redundancy",
                "rationale": "Risk increases significantly during extreme weather scenarios",
                "priority": "High"
            })

    # Rule 3: Load sensitivity
    for s in scenarios:
        if s["scenario_name"] == "Load Surge" and s["delta"] >= 8:
            recommendations.append({
                "action": "Increase relay/tower density",
                "rationale": "Network degrades sharply under population or traffic surge",
                "priority": "Medium"
            })

    # Rule 4: Network weakness
    if features["backhaul_redundancy"] < 0.3:
        recommendations.append({
            "action": "Improve backhaul redundancy",
            "rationale": "Single-point backhaul failure risk detected",
            "priority": "High"
        })

    if features["tower_density"] < 2:
        recommendations.append({
            "action": "Plan additional relay placement",
            "rationale": "Low tower density relative to region area",
            "priority": "Medium"
        })

    # Fallback
    if not recommendations:
        recommendations.append({
            "action": "Maintain current infrastructure",
            "rationale": "Region classified as stable across all tested scenarios",
            "priority": "Low"
        })

    return recommendations
