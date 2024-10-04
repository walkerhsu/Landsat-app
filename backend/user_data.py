from pydantic import BaseModel

class Location(BaseModel):
    lat: float
    lon: float
    subscribed: bool
    index: int

class UserData(BaseModel):
    name: str
    email: str
    profile_image: str | None
    locations: list[Location]

