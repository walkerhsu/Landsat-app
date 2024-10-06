from fastapi import APIRouter, HTTPException
from user_data import UserData
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

# Use a service account.
cred = credentials.Certificate('secret/firestore-sa.json')

app = firebase_admin.initialize_app(cred)

db = firestore.client()

profile_router = APIRouter()


@profile_router.get("/profile/read/{user_id}")
async def read_profile(user_id: str):
    try: 
        doc = db.collection('users').document(user_id)
        data = doc.get()
        
        if not data.exists:
            raise HTTPException(status_code=404, detail="User not found")
        
        return data.to_dict()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@profile_router.post("/profile/save")
async def save_profile(user_data: UserData):
    
    try:
        doc = db.collection('users').document(user_data.id)
        data = doc.get()
        if data.exists:
            raise HTTPException(status_code=404, detail="User already exists")
        doc.set(user_data.model_dump())
        user_data = user_data.model_dump()
        user_data['status'] = "saved"
        
        return {"status": "saved", "id": user_data['id']}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



@profile_router.post("/profile/update")
async def update_profile(user_data: UserData):
    try: 
        doc = db.collection('users').document(user_data.id)
        doc.update(user_data.model_dump())
        return {"status": "updated", "id": user_data.id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@profile_router.delete("/profile/delete/{user_id}")
async def delete_profile(user_id: str):
    try:
        doc = db.collection('users').document(user_id)
        doc.delete()
        return {"status": "deleted", "id": user_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
