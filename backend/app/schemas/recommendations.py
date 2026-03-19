from pydantic import BaseModel
from typing import List

class Recommendation(BaseModel):
    action: str
    rationale: str
    priority: str  # "High" | "Medium" | "Low"
