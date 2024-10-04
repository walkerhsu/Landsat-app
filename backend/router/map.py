from fastapi import APIRouter, Query
from typing import List
from user_data import Location

map_router = APIRouter()

@map_router.get("/map/dataset")
def get_dataset(
    startDate: str = Query(...),
    endDate: str = Query(...),
    locations: List[str] = Query(...)
):
    return {"message": "Dataset fetched successfully"}

@map_router.get("/map/geojson")
def get_geojson(
    categoryID: str = Query(...),
    locations: List[str] = Query(...)
):
    return {"message": "GeoJSON fetched successfully"}

@map_router.get("/map/pixel")
def get_pixel_data(
    datasetID: str = Query(...),
    lat: float = Query(...),
    lon: float = Query(...)
):
    return {"message": "Pixel data fetched successfully"}

@map_router.get("/map/download")
def download_dataset(
    categoryID: str = Query(...),
    locations: List[str] = Query(...),
    dates: List[str] = Query(...)
):
    return {"message": "Dataset downloaded successfully"}
