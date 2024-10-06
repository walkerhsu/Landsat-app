from fastapi import APIRouter, HTTPException, Query
from typing import List

from fastapi.responses import FileResponse
import httpx
from user_data import LatLng, CloudCoverage, SR_data
from globals import landsat_grid_analyzer
from pydantic import BaseModel

from utils.chat_completion import chat_completion

map_router = APIRouter()


class DatasetInput(BaseModel):
    startDate: str
    endDate: str
    cloudCoverage: CloudCoverage
    locations: List[LatLng]


@map_router.post("/map/dataset")
async def get_dataset(input: DatasetInput):
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


@map_router.post("/map/geojson")
def get_geojson(input: GeoJsonInput):
    try:
        print(input.datasetID, input.location)
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


@map_router.post("/map/download")
def download_dataset(input: DownloadInput):
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
                row = [str(i + 1)] + [str(value) for value in all_SR_data[i].values()]
                f.write(",".join(row) + "\n")
        return {
            "file": FileResponse(
                f"./{filename}.csv",
                media_type="application/octet-stream",
                filename=f"{filename}.csv",
            ),
            "filename": filename,
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@map_router.get("/map/geocoding")
async def reverse_geocode(
    latitude: float = Query(..., description="Latitude"),
    longitude: float = Query(..., description="Longitude"),
    access_token: str = Query(..., description="Access Token"),
):
    try:
        # Construct the URL with parameters
        url = f"https://api.mapbox.com/search/geocode/v6/reverse"
        params = {
            "longitude": longitude,
            "latitude": latitude,
            "access_token": access_token,
        }

        # Send the request using httpx for async request handling
        async with httpx.AsyncClient() as client:
            response = await client.get(url, params=params)

        # Check if the response is successful
        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail=response.text)

        # Return the response JSON
        return response.json()

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
        raise HTTPException(status_code=400, detail=str(e)) 

class LLMQueryInput(BaseModel):
    API_KEY: str
    query: SR_data

@map_router.get("/map/LLM_query")
def LLM_query(
    input: LLMQueryInput
):
    try:
        chat_completion(input.query, input.API_KEY)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e)) 
