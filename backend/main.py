from fastapi import FastAPI
from user_data import UserData, Location

app = FastAPI()
    
@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/users/{user_id}")
def read_item(user_id: str):
    sample_user = UserData(
        name="John Doe",
        email="test@gmail.com",
        profile_image="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
        locations=[
            Location(lat=37.7749, lon=-122.4194, subscribed=True, index=0),
            Location(lat=34.0522, lon=-118.2437, subscribed=False, index=1),
        ]
    )
    return sample_user.model_dump()

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)