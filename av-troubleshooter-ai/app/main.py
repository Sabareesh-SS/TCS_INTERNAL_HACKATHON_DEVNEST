from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.health import router as health_router
from app.api.diagnostics import router as diagnostics_router
from app.api.inventory import router as inventory_router
from app.config import settings

app = FastAPI(
    title="Smart Classroom AV Troubleshooting Assistant - AI Engine",
    description="Backend AI Diagnostic Engine providing RAG-grounded troubleshooting steps, fault category classification, and escalation evidence.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Enable CORS for Mobile (Flutter/React Native) and Web Dashboard (React/Next.js/Vue)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(health_router)
app.include_router(diagnostics_router)
app.include_router(inventory_router)


@app.get("/", tags=["Root"])
async def root():
    return {
        "service": "Smart Classroom AV Troubleshooting Assistant - AI Diagnostic Engine",
        "member": "Member 3 — LLM + RAG + Knowledge Base + Backend Integration",
        "docs": "/docs",
        "health": "/api/health",
        "diagnostics": "/api/diagnostics/next-step",
        "inventory_scan": "/api/inventory/scan/{qr_id}"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=settings.DEBUG)
