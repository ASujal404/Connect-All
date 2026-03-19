from shapely.geometry import Point, box
from typing import Dict

# Mock region centroids (simulated geography)
REGION_CENTROIDS = {
    "region_1": (19.95, 79.30),
    "region_2": (20.10, 79.80),
    "region_3": (19.70, 79.10),
}

def geometry_from_region(region_request) -> Dict:
    """
    Converts region input into a shapely geometry and
    basic spatial descriptors.
    Prioritizes bounding_box if provided, falls back to region_id.
    """
    # Prefer bounding box if provided
    if region_request.bounding_box:
        bbox = region_request.bounding_box
        geom = box(
            bbox.min_lon,
            bbox.min_lat,
            bbox.max_lon,
            bbox.max_lat
        )

        return {
            "geometry": geom,
            "area_sq_km": geom.area * 12365,  # rough deg² → km² scaling
            "geometry_type": "polygon"
        }

    # Fall back to region_id
    if region_request.region_id:
        if region_request.region_id not in REGION_CENTROIDS:
            raise ValueError("Unknown region_id")

        lat, lon = REGION_CENTROIDS[region_request.region_id]
        geom = Point(lon, lat)

        return {
            "geometry": geom,
            "area_sq_km": 10.0,        # fixed mock area
            "geometry_type": "point"
        }

    raise ValueError("Either region_id or bounding_box must be provided")
