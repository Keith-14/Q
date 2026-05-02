from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import router
import os

app = FastAPI(
    title="Barakah Halal Engine",
    description="AI-powered halal product analysis API",
    version="1.0.0",
)

origins = (
    ["http://localhost:5173"]
    if os.getenv("ENV") == "development"
    else ["*"]
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)


@app.get("/")
async def root():
    return {"status": "ok", "message": "Barakah engine is running"}