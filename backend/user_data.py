from pydantic import BaseModel


class LatLon(BaseModel):
    lat: float
    lng: float


class Location(BaseModel):
    place: str
    latlng: LatLon
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
    
