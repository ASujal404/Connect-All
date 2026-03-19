import requests
import numpy as np

OPEN_METEO_URL = "https://archive-api.open-meteo.com/v1/archive"

def extract_weather_features(lat: float, lon: float):
    params = {
        "latitude": lat,
        "longitude": lon,
        "start_date": "2020-01-01",
        "end_date": "2020-12-31",
        "daily": "precipitation_sum,temperature_2m_max,temperature_2m_min",
        "timezone": "UTC"
    }

    r = requests.get(OPEN_METEO_URL, params=params, timeout=20)
    r.raise_for_status()
    data = r.json()["daily"]

    rainfall = np.array(data["precipitation_sum"])
    tmax = np.array(data["temperature_2m_max"])
    tmin = np.array(data["temperature_2m_min"])

    avg_rainfall = float(np.mean(rainfall))
    storm_frequency = int(np.sum(rainfall > 20))  # heavy rain days
    temp_variance = float(np.var(tmax - tmin))

    return {
        "avg_rainfall": round(avg_rainfall, 2),
        "storm_frequency": storm_frequency,
        "temperature_variance": round(temp_variance, 2)
    }
