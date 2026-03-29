"""
VerdaChain AI Verification Microservice

FastAPI application factory with CORS, routing, and OpenAPI configuration.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.verify import router as verify_router


def create_app() -> FastAPI:
    """Create and configure the FastAPI application."""

    app = FastAPI(
        title="VerdaChain AI Verification API",
        description=(
            "AI-powered carbon credit risk analysis microservice. "
            "Detects fraud, duplicate credits, and greenwashing using "
            "simulated machine learning models and satellite data cross-referencing."
        ),
        version="1.0.0",
        docs_url="/docs",
        redoc_url="/redoc",
    )

    # ── CORS — allow frontend origins ──
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[
            "http://localhost:3000",          # Next.js dev
            "http://127.0.0.1:3000",
            "https://*.vercel.app",           # Vercel deployments
            "*",                              # Allow all for demo
        ],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # ── Routes ──
    app.include_router(verify_router, tags=["Verification"])

    # ── Health check ──
    @app.get("/", tags=["Health"])
    async def health_check():
        return {
            "service": "VerdaChain AI Verification API",
            "status": "online",
            "version": "1.0.0",
        }

    @app.get("/health", tags=["Health"])
    async def health():
        return {"status": "ok"}

    return app


app = create_app()
