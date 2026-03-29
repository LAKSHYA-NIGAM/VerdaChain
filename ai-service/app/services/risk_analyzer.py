"""
AI Risk Scoring Service

Deterministic scoring for known credit IDs; realistic randomized analysis
for unknown IDs. Simulates AI processing delay.
"""

import asyncio
import random
import hashlib
from datetime import datetime, timezone
from typing import List, Tuple

from app.models.schemas import VerifyResponse


# ─── Flag Pool (realistic carbon credit fraud indicators) ─────────────────────

FLAG_POOL: List[str] = [
    # Registry flags
    "Duplicate credit detected across multiple registries",
    "Registry inconsistency: issuance date predates project validation",
    "Cross-registry duplicate check returned inconclusive results",
    "Credit retirement records show timing discrepancies",
    "Vintage year mismatch across linked credit batches",

    # Satellite / MRV flags
    "Satellite imagery shows significant deforestation mismatch in project area",
    "NDVI analysis indicates 30%+ vegetation cover decline since baseline",
    "Reforestation coverage below claimed project boundary",
    "Temporal satellite comparison reveals boundary discrepancy",
    "Cloud cover in recent satellite pass — pending re-scan",

    # Methodology flags
    "Additionality claim flagged — baseline emissions appear inflated by 40%+",
    "MRV report shows discrepancy in emission reduction calculations",
    "Methodology version mismatch with current registry standards",
    "Leakage assessment incomplete — upstream emissions unaccounted",
    "Permanence risk: project lacks 100-year sequestration guarantee",

    # Audit flags
    "Third-party audit certification expired — renewal pending",
    "Verification body accreditation under review",
    "Minor documentation gap in quarterly MRV report",
    "Project boundary overlap with adjacent conservation zone",
    "Stakeholder consultation records incomplete",

    # Project flags
    "Project developer flagged in 2 other credit investigations",
    "Financial additionality questionable — project commercially viable pre-credits",
    "Co-benefits claims lack independent verification",
    "Buffer pool contribution below recommended threshold",
    "Historical data insufficient for reliable baseline assessment",
]

# ─── Known Credit Profiles ───────────────────────────────────────────────────

KNOWN_PROFILES: dict = {
    "VCU-12345": {
        "riskScore": 78,
        "flags": [
            "Duplicate credit detected across multiple registries",
            "Satellite imagery shows significant deforestation mismatch in project area",
        ],
        "confidence": 94.2,
    },
    "GS-67890": {
        "riskScore": 22,
        "flags": [
            "Minor documentation gap in quarterly MRV report",
        ],
        "confidence": 97.8,
    },
    "ACR-11223": {
        "riskScore": 45,
        "flags": [
            "Reforestation coverage below claimed project boundary",
            "Credit retirement records show timing discrepancies",
        ],
        "confidence": 91.5,
    },
}


def _seeded_random(credit_id: str) -> random.Random:
    """Create a seeded Random instance for deterministic results per credit ID."""
    seed = int(hashlib.sha256(credit_id.upper().encode()).hexdigest(), 16) % (2**32)
    return random.Random(seed)


def _generate_flags(rng: random.Random, risk_score: int) -> List[str]:
    """Select 1-3 flags weighted by risk level."""
    if risk_score >= 70:
        count = rng.randint(2, 3)
    elif risk_score >= 40:
        count = rng.randint(1, 3)
    else:
        count = rng.randint(1, 2)

    return rng.sample(FLAG_POOL, min(count, len(FLAG_POOL)))


def _calculate_confidence(risk_score: int, flag_count: int) -> float:
    """
    Higher risk scores with more flags = higher AI confidence.
    Low-risk credits with few flags also get high confidence.
    Mid-range scores get slightly lower confidence (ambiguous).
    """
    base = 85.0
    if risk_score <= 30 or risk_score >= 70:
        base = 92.0  # Clear-cut cases
    base += flag_count * 1.2
    return round(min(base + random.uniform(0, 5), 99.9), 1)


async def analyze_credit(credit_id: str) -> VerifyResponse:
    """
    Run AI risk analysis on a carbon credit.

    Known IDs return fixed profiles; unknown IDs get deterministic
    results seeded by the credit ID hash.
    """
    # Simulate AI processing time (1.5 – 3.0 seconds)
    delay = random.uniform(1.5, 3.0)
    await asyncio.sleep(delay)

    normalized_id = credit_id.strip().upper()

    # ── Known profile lookup ──
    if normalized_id in KNOWN_PROFILES:
        profile = KNOWN_PROFILES[normalized_id]
        return VerifyResponse(
            creditId=normalized_id,
            riskScore=profile["riskScore"],
            flags=profile["flags"],
            confidence=profile["confidence"],
            timestamp=datetime.now(timezone.utc),
        )

    # ── Generate deterministic results for unknown IDs ──
    rng = _seeded_random(normalized_id)
    risk_score = rng.randint(20, 90)
    flags = _generate_flags(rng, risk_score)
    confidence = _calculate_confidence(risk_score, len(flags))

    return VerifyResponse(
        creditId=normalized_id,
        riskScore=risk_score,
        flags=flags,
        confidence=confidence,
        timestamp=datetime.now(timezone.utc),
    )
