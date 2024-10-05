import asyncio
import json
from fastapi import APIRouter, HTTPException, Query
from typing import List

from fastapi.responses import FileResponse
from utils.get_google_band_data import LandsatGridAnalyzer
from utils.parse_location import parse_location
from user_data import Location, LatLng, CloudCoverage
from globals import landsat_grid_analyzer
from pydantic import BaseModel

map_router = APIRouter()

class DatasetInput(BaseModel):
    startDate: str
    endDate: str
    cloudCoverage: CloudCoverage
    locations: List[LatLng]


@map_router.get("/map/dataset")
async def get_dataset(
    input: DatasetInput
):
    # # Parse the locations string into a list of LatLng objects
    try:
        all_dataset_list = await landsat_grid_analyzer.process_all_locations(
            input.locations, input.startDate, input.endDate, input.cloudCoverage
        )
        return all_dataset_list
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

class GeoJsonInput(BaseModel):
    datasetID: str
    location: LatLng

@map_router.get("/map/geojson")
def get_geojson(
    input: GeoJsonInput
):
    try:
        all_geojson = landsat_grid_analyzer.process_all_corners(
            input.datasetID, input.location
        )
        return all_geojson
    except Exception as e:
        # raise e
        raise HTTPException(status_code=400, detail=str(e))

class PixelInput(BaseModel):
    datasetID: str
    location: LatLng

class DownloadInput(BaseModel):
    download_data: PixelInput

@map_router.get("/map/download")
def download_dataset(
    input: DownloadInput
):
    try:
        datasetID = input.download_data.datasetID
        location = input.download_data.location
        all_SR_data = landsat_grid_analyzer.download_dataset(datasetID, location)
        # write with csv format, header is the keys of the SR_data
        keys = ["index", "lat", "lng"] + list(all_SR_data[0].keys())
        filename = datasetID.replace("/", "_")
        with open(f"./{filename}.csv", "w") as f:
            f.write(",".join(keys) + "\n")
            for i in range(len(all_SR_data)):
                row = [str(i+1)] + [str(value) for value in all_SR_data[i].values()]
                f.write(",".join(row) + "\n")
        return {
            "file":FileResponse(f"./{filename}.csv", media_type='application/octet-stream', filename=f"{filename}.csv"),
            "filename": filename
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e)) 
