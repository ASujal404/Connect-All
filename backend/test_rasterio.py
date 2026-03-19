from shapely.geometry import box
from app.services.terrain_real import extract_terrain_features

geom = box(79.0, 19.8, 79.5, 20.2)
print(extract_terrain_features(geom))
