from fastapi import APIRouter
from user_data import UserData, Location

profile_router = APIRouter()


@profile_router.get("/profile/")
def read_item(user_id: str):
    sample_user = UserData(
        name="John Doe",
        email="test@gmail.com",
        profile_image="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
        locations=[
            Location(lat=37.7749, lon=-122.4194, subscribed=True, index=0),
            Location(lat=34.0522, lon=-118.2437, subscribed=False, index=1),
        ],
    )
    return sample_user.model_dump()


@profile_router.put("/profile/save")
def save_profile(name: str, email: str, joinDate: str):
    return {"message": "Profile saved successfully"}


@profile_router.patch("/profile/update")
def update_profile(name: str, email: str, joinDate: str):
    return {"message": "Profile updated successfully"}


@profile_router.delete("/profile/delete")
def delete_profile(name: str, email: str, joinDate: str):
    return {"message": "Profile deleted successfully"}
