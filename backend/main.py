import psycopg2
from dotenv import load_dotenv
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes import router as api_router
from database import engine, Base


Base.metadata.create_all(bind=engine)


app = FastAPI()


app.include_router(router=api_router)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


@app.get("/")
async def root():
    return {"message": "API is running!"}