from fastapi import APIRouter

router = APIRouter(prefix="/health", tags=["health"])

@router.get("")
def health_check():
    return {
        "status": "ok",
        "service": "sdg-9-11-backend"
    }
