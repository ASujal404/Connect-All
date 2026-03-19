from typing import Dict

def build_feature_vector(
    raw_data: Dict,
    geo_data: Dict
) -> Dict[str, float]:
    """
    Combine all signals into a flat feature vector.
    """

    terrain = raw_data["terrain"]
    population = raw_data["population"]
    weather = raw_data["weather"]
    network = raw_data["network"]

    features = {
        # Terrain
        "avg_elevation": terrain["avg_elevation"],
        "terrain_variance": terrain["terrain_variance"],
        "slope_mean": terrain["slope_mean"],

        # Population
        "pop_density": population["pop_density"],
        "pop_growth": population["pop_growth"],

        # Weather
        "avg_rainfall": weather["avg_rainfall"],
        "storm_frequency": weather["storm_frequency"],
        "temperature_variance": weather["temperature_variance"],

        # Network
        "tower_density": network["tower_density"],
        "avg_uptime": network["avg_uptime"],
        "backhaul_redundancy": network["backhaul_redundancy"],

        # Geo
        "region_area_sq_km": geo_data["area_sq_km"],
    }

    return features
