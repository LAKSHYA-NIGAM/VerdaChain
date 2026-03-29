"""
Verification route — POST /verify
"""

from fastapi import APIRouter, HTTPException
from app.models.schemas import VerifyRequest, VerifyResponse
from app.services.risk_analyzer import analyze_credit

router = APIRouter()


@router.post(
    "/verify",
    response_model=VerifyResponse,
    summary="Verify a carbon credit",
    description="Runs AI-powered risk analysis on a carbon credit ID and returns "
                "a risk score, fraud flags, and confidence percentage.",
    responses={
        200: {"description": "Verification completed successfully"},
        422: {"description": "Invalid credit ID format"},
    },
)
async def verify_credit(request: VerifyRequest) -> VerifyResponse:
    """
    Analyze a carbon credit for fraud indicators.

    - **creditId**: The carbon credit identifier (e.g., VCU-12345, GS-67890)
    - Returns risk score (0-100), fraud flags, AI confidence, and timestamp
    """
    try:
        result = await analyze_credit(request.creditId)
        return result
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Analysis failed: {str(e)}",
        )
