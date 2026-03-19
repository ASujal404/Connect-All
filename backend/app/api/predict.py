from fastapi import APIRouter, HTTPException
from app.schemas.region import RegionRequest
from app.services.geo import geometry_from_region
from app.services.data_loader import load_all_region_data
from app.services.features import build_feature_vector
from app.services.ml import risk_model
from app.services.simulation import simulate_scenarios
from app.services.recommendation import generate_recommendations
from app.services.weather_real import extract_weather_features
from app.services.region_naming import get_region_name

centroid = geo_data["geometry"].centroid
raw_data["weather"] = extract_weather_features(
    lat=centroid.y,
    lon=centroid.x
)


router = APIRouter(prefix="/predict", tags=["prediction"])

@router.post("")
def predict_region(region: RegionRequest):
    try:
        # 1. Normalize geometry
        geo_data = geometry_from_region(region)

        # 2. Load mock data
        if not region.region_id:
            raise ValueError("region_id required for mock data")

        raw_data = load_all_region_data(region.region_id)

        # Extract real DEM-based terrain using bounding box geometry
        from app.services.data_loader import load_real_terrain
        raw_data["terrain"] = load_real_terrain(geo_data["geometry"])

        # 3. Feature engineering
        features = build_feature_vector(raw_data, geo_data)

        # 4. Base risk prediction
        risk = risk_model.predict(features)

        # 5. Scenario simulation
        scenarios = simulate_scenarios(
            base_features=features,
            base_risk_score=risk["risk_score"]
        )

        # 6. Recommendations
        recommendations = generate_recommendations(
            risk=risk,
            scenarios=scenarios,
            features=features
        )

        return {
            "region": region.region_id,
            "risk": risk,
            "scenarios": scenarios,
            "recommendations": recommendations
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    


centroid = geo_data["geometry"].centroid
region_name = get_region_name(centroid.y, centroid.x)

