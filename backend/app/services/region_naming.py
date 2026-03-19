import requests

NOMINATIM_URL = "https://nominatim.openstreetmap.org/reverse"

def get_region_name(lat: float, lon: float):
    params = {
        "lat": lat,
        "lon": lon,
        "format": "json",
        "zoom": 10
    }

    headers = {
        "User-Agent": "sdg-9-11-backend"
    }

    r = requests.get(NOMINATIM_URL, params=params, headers=headers, timeout=10)
    r.raise_for_status()
    data = r.json()

    return data.get("display_name", "Unknown Region")
