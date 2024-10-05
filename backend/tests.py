import requests

from user_data import UserData, Location


def test_user_data():
    response = requests.post(
        "http://localhost:8000/api/profile/save",
        json={
            "id": "test",
            "name": "John",
            "email": "",
            "avatarUrl": "",
            "locationHistory": []
        }
    )
    print(response.json())
    
    response = requests.get(
        "http://localhost:8000/api/profile/read/test",
    )
    print(response.json())
    
    response = requests.post(
        "http://localhost:8000/api/profile/update",
        json={
            "id": "test",
            "name": "John",
            "email": "",
            "avatarUrl": "",
            "locationHistory": [
                Location(place="test", latlng={"lat": 0.0, "lng": 0.0}, dataset="test", addedDate="test").model_dump()
            ]
        }
    )
    print(response.json())
    
    response = requests.get(
        "http://localhost:8000/api/profile/read/test",
    )
    print(response.json())
    
    response = requests.delete(
        "http://localhost:8000/api/profile/delete/test",
    )
    print(response.json())
    
    response = requests.get(
        "http://localhost:8000/api/profile/read/test",
    )
    print(response.json())
    
    

test_user_data()