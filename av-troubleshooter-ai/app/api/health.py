from fastapi import APIRouter
from datetime import datetime, timezone
from app.schemas.diagnostic import HealthResponse

router = APIRouter(prefix="/api", tags=["System Health"])


@router.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint to confirm service availability."""
    return HealthResponse(
        status="ok",
        service="av-troubleshooter-ai",
        version="1.0.0",
        timestamp=datetime.now(timezone.utc).isoformat()
    )

