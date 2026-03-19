from pydantic import BaseModel
from typing import Dict

class RiskPrediction(BaseModel):
    risk_score: float          # 0–100
    risk_class: str            # "Stable" | "At-risk"
    feature_importance: Dict[str, float]
