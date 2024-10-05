from pydantic import BaseModel


class LatLng(BaseModel):
    lat: float
    lng: float


class Geometry(BaseModel):
    type: str
    coordinates: list[list[list[float]]]


class Feature(BaseModel):
    type: str
    properties: dict
    geometry: Geometry


class GeoJson(BaseModel):
    type: str
    features: list[Feature]


class Location(BaseModel):
    place: str
    latlng: LatLng
    dataset: str
    addedDate: str
    
class Detail(BaseModel):
    label: str
    field: str


class UserData(BaseModel):
    id: str
    name: str
    avatarUrl: str
    email: str
    phone: str
    details: list[Detail]
    locationHistory: list[Location]
