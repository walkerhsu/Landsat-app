import asyncio
import json
from fastapi import APIRouter, HTTPException, Query
from typing import List
from utils.get_google_band_data import LandsatGridAnalyzer
from utils.parse_location import parse_location
from user_data import Location, LatLng
from globals import landsat_grid_analyzer

map_router = APIRouter()


@map_router.get("/map/dataset")
async def get_dataset(
    startDate: str,
    endDate: str,
    locations: str = Query(..., description="JSON string of LatLng objects"),
):
    # # Parse the locations string into a list of LatLng objects
    try:
        parsed_locations = parse_location(locations)
        all_dataset_list = await landsat_grid_analyzer.process_all_locations(
            parsed_locations, startDate, endDate
        )
        return {
            "error": None,
            "datasets": all_dataset_list,
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@map_router.get("/map/geojson")
async def get_geojson(
    categoryID: str,
    locations: str = Query(..., description="JSON string of LatLng objects"),
):
    try:
        parsed_locations = parse_location(locations)
        all_geojson = await landsat_grid_analyzer.process_all_corners(
            categoryID, parsed_locations
        )
        return {
            "error": None,
            "geojsons": all_geojson,
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@map_router.get("/map/pixel")
def get_pixel_data(
    datasetID: str = Query(...),
    lat: str = Query(...),
    lng: str = Query(...),
):
    try:
        SR_data = landsat_grid_analyzer.get_pixel_data(
            datasetID, float(lat), float(lng)
        )
        return {
            "error": None,
            "SR_data": SR_data,
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@map_router.get("/map/download")
def download_dataset(
    queries: str = Query(...),
):
    try:
        queries = json.loads(queries)
        SR_data = []
        for datasetID in queries.keys():
            for location in queries[datasetID]:
                lat = float(location["lat"])
                lng = float(location["lng"])
                SR_data.append({
                    "lat": lat,
                    "lng": lng,
                    "datasetID": datasetID,
                    "SR_data": landsat_grid_analyzer.get_pixel_data(datasetID, lat, lng)
                })

        return {
            "error": None,
            "download_data": SR_data
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
