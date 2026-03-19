import pandas as pd
from pathlib import Path
from app.services.terrain_real import extract_terrain_features

BASE_PATH = Path(__file__).resolve().parents[1]
RAW_DATA_PATH = BASE_PATH / "data" / "raw"

def load_dataset(filename: str) -> pd.DataFrame:
    path = RAW_DATA_PATH / filename
    if not path.exists():
        raise FileNotFoundError(f"Missing dataset: {filename}")
    return pd.read_csv(path)

def load_all_region_data(region_id: str) -> dict:
    terrain = load_dataset("terrain.csv")
    population = load_dataset("population.csv")
    weather = load_dataset("weather.csv")
    network = load_dataset("network.csv")

    def extract(df):
        row = df[df["region_id"] == region_id]
        if row.empty:
            raise ValueError(f"Region not found: {region_id}")
        return row.iloc[0].to_dict()

    return {
        "terrain": extract(terrain),
        "population": extract(population),
        "weather": extract(weather),
        "network": extract(network),
    }


def load_real_terrain(geometry):
    return extract_terrain_features(geometry)

