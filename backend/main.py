from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.stats import router as stats_router

app = FastAPI(
    title="Corinthians Dashboard API",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(stats_router)


@app.get("/")
def root():
    return {
        "message": "Corinthians Dashboard API online",
        "docs": "/docs",
    }
