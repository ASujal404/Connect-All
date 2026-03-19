import rasterio
import numpy as np
from rasterio.mask import mask
from shapely.geometry import mapping

def extract_terrain_features(geometry):
    dem_path = "app/data/raw/dem/output_SRTMGL1.tif"

    with rasterio.open(dem_path) as src:
        clipped, _ = mask(
            src,
            [mapping(geometry)],
            crop=True,
            filled=True,
            nodata=src.nodata
        )

        elevation = clipped[0].astype(float)

        # Build valid-data mask
        valid = elevation != src.nodata
        if valid.sum() < 10:  # Relaxed threshold for small regions
            raise ValueError("Insufficient DEM coverage for region")

        # Elevation stats
        valid_elev = elevation[valid]
        avg_elevation = float(np.mean(valid_elev))
        elevation_variance = float(np.var(valid_elev))

        # Slope (computed on 2D grid, then masked)
        gy, gx = np.gradient(elevation)
        slope = np.sqrt(gx**2 + gy**2)
        slope_mean = float(np.mean(slope[valid]))

        return {
            "avg_elevation": round(avg_elevation, 2),
            "terrain_variance": round(elevation_variance, 2),
            "slope_mean": round(slope_mean, 4)
        }
