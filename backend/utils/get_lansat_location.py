import time
from utils.firebase import db
from datetime import datetime
from user_data import LatLng
from utils.transform import Latlng2WRS2, WRS22LatLng

max_row = 248
STEP_TIME = (99*60/max_row)
CYCLE_TIME = 16 * 24 * 60 * 60

def location_add_n_steps(path, row, n):
    path_increase = n // max_row
    path += path_increase * 16
    while path > 233:
        path = path - 233
    row_increase = n % max_row
    row += row_increase
    if row > max_row:
        path += 16
        if path > 233:
            path = path - 233
        row = row - max_row
    return path, row

def path_diff(path_start, path_end):
    n = 0
    while path_start != path_end:
        path_start += 16
        n += 1
        if path_start > 233:
            path_start = path_start - 233
    return n

def path_row_diff(path_start, row_start, path_end, row_end):
    return path_diff(path_start, path_end) * max_row + row_end - row_start

def get_latest_landsat_location():
    data = db.collection('environments').document('landsat_latest_path_row').get()
    if not data.exists:
        raise ValueError("No data found")
    data = data.to_dict()
    return data

def update_latest_landsat_location(path, row, acquisition_time: datetime, landsat_id: str="9"):
    
    latest_landsat_location = get_latest_landsat_location()
    latest_landsat_location = latest_landsat_location[landsat_id]
    timestamp = acquisition_time.timestamp()
    if timestamp > latest_landsat_location['time']:
        return None
    
    db.collection('environments').document('landsat_latest_path_row').update(
        {
            f'{landsat_id}': {
                'path': path,
                'row': row,
                'time': timestamp
            }
        }
    )
    
    return None

def get_landsat_location(landsat_id: str="9"):
    latest_landsat_location = get_latest_landsat_location()
    landsat_id = str(landsat_id)
    latest_landsat_location = latest_landsat_location[landsat_id]
    path = latest_landsat_location['path']
    row = latest_landsat_location['row']
    current_time = time.time()
    time_diff = current_time - latest_landsat_location['time']
    steps_diff = int(time_diff / STEP_TIME)
    path, row = location_add_n_steps(path, row, steps_diff)
    return WRS22LatLng(path, row)

def next_landsat_time(latlng: LatLng) -> float:
    path, row = Latlng2WRS2(latlng.lat, latlng.lng)
    latest_landsat_location = get_latest_landsat_location()
    
    next_closest_time = None
    landsat_id = None
    
    for id in ['9', '8']:
        latest_location = latest_landsat_location[id]
        latest_path, latest_row = latest_location['path'], latest_location['row']
        latest_time = latest_location['time']
        steps_diff = path_row_diff(latest_path, latest_row, path, row)
        next_time = latest_time + steps_diff * STEP_TIME
        current_time = time.time()
        while next_time < current_time:
            next_time += CYCLE_TIME
        if next_closest_time is None or next_time < next_closest_time:
            next_closest_time = next_time
            landsat_id = id
        
    return next_closest_time, landsat_id


if __name__ == "__main__":
    print(get_landsat_location())
    print(next_landsat_time(LatLng(24.8020, 121.4484)).ctime())