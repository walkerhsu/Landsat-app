from fastapi import APIRouter, HTTPException
from user_data import Location
from utils.get_lansat_location import next_landsat_time
from utils.get_lansat_location import get_landsat_location
from datetime import datetime

timer_router = APIRouter()

@timer_router.post("/closestLandsatTime")
async def get_closest_landsat_time(location_list: list[Location]):
    
    if not location_list:
        raise HTTPException(status_code=400, detail="No locations provided")
    
    closest_time = None
    closest_location = None
    closest_landsat = None
    for location in location_list:
        next_time, landsat_id = next_landsat_time(location.latlng)
        if closest_time is None or next_time < closest_time:
            closest_time = next_time
            closest_location = location
            closest_landsat = landsat_id
    
    closest_time = datetime.fromtimestamp(closest_time)
    return {
        "next_time": closest_time,
        "location": closest_location.model_dump(),
        "landsat": closest_landsat
    }

# @timer_router.post("/closestLandsatTime")
# async def get_closest_landsat_time(location_list: list[Location]):
    
#     if not location_list:
#         raise HTTPException(status_code=400, detail="No locations provided")
    
#     closest_time = None
#     closest_location = None
#     closest_landsat = None
#     for location in location_list:
#         next_time, landsat_id = next_landsat_time(location.latlng)
#         if closest_time is None or next_time < closest_time:
#             closest_time = next_time
#             closest_location = location
#             closest_landsat = landsat_id
    
#     closest_time = datetime.fromtimestamp(closest_time)
#     return {
#         "next_time": closest_time,
#         "location": closest_location.model_dump(),
#         "landsat": closest_landsat
#     }
    
@timer_router.get("/getLandsatLocation/{landsat_id}")
async def get_current_landsat_location(landsat_id: str):
    return get_landsat_location(landsat_id=landsat_id)