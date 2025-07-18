from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app import database, crud
from app.auth import router as auth_router
from app.routers import router as api_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    db = next(database.get_db())
    crud.create_admin_if_not_exists(db)

app.include_router(auth_router, prefix="/api/auth", tags=["auth"])
app.include_router(api_router, prefix="/api", tags=["api"])

@app.get("/health")
def health_check():
    return {"status": "ok"} 