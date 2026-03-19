from pydantic import BaseModel
from typing import Dict

class ScenarioResult(BaseModel):
    scenario_name: str
    adjusted_risk_score: float
    delta: float
    contributing_factors: Dict[str, float]
