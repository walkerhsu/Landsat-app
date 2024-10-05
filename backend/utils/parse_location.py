import json
from typing import List

from user_data import LatLng


def parse_location(locations: List[str]) -> List[LatLng]:
    try:
        locations_list = json.loads(locations)
        parsed_locations = [LatLng(**loc) for loc in locations_list]
    except json.JSONDecodeError:
        raise ValueError("Invalid JSON format for locations")
    except TypeError:
        raise ValueError("Invalid LatLng object format")
    return parsed_locations
