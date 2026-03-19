from pydantic import BaseModel
from typing import Optional, List

class BoundingBox(BaseModel):
    min_lat: float
    min_lon: float
    max_lat: float
    max_lon: float

class RegionRequest(BaseModel):
    region_id: Optional[str] = None
    bounding_box: Optional[BoundingBox] = None
