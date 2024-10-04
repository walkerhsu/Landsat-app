from fastapi import FastAPI
from router.profile import profile_router
from router.map import map_router

app = FastAPI()

@app.get("/")
def read_root():
    return {"Hello": "World"}

# Include the routers
app.include_router(profile_router, prefix="/api")
app.include_router(map_router, prefix="/api")

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)