"""
Pydantic schemas for request/response validation.
"""

from pydantic import BaseModel, Field
from typing import List
from datetime import datetime


class VerifyRequest(BaseModel):
    """Incoming verification request."""
    creditId: str = Field(
        ...,
        min_length=1,
        max_length=50,
        description="Carbon credit identifier (e.g., VCU-12345)",
        examples=["VCU-12345", "GS-67890", "ACR-11223"],
    )


class VerifyResponse(BaseModel):
    """AI verification result."""
    creditId: str
    riskScore: int = Field(..., ge=0, le=100)
    flags: List[str]
    confidence: float = Field(..., ge=0, le=100, description="AI confidence percentage")
    timestamp: datetime
