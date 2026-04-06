from fastapi import APIRouter
from app.services.analysis_service import (
    get_stats_ramon, get_stats_dorival,
    get_matches_ramon, get_matches_dorival,
    get_players, get_goalkeepers,
)

router = APIRouter(prefix="/stats", tags=["stats"])

@router.get("/ramon")
def stats_ramon():
    return get_stats_ramon()

@router.get("/dorival")
def stats_dorival():
    return get_stats_dorival()

@router.get("/compare")
def stats_compare():
    return {"ramon": get_stats_ramon(), "dorival": get_stats_dorival()}

@router.get("/matches/ramon")
def matches_ramon():
    return get_matches_ramon()

@router.get("/matches/dorival")
def matches_dorival():
    return get_matches_dorival()

@router.get("/players")
def players():
    return get_players()

@router.get("/goalkeepers")
def goalkeepers():
    return get_goalkeepers()
