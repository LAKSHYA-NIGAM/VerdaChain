import os
import json
from openai import OpenAI
from mock_registry import get_credit_data

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def analyze_credit(credit_id: str) -> dict:
    registry_data = get_credit_data(credit_id)

    if not registry_data:
        return {
            "creditId": credit_id,
            "riskScore": 95,
            "status": "HIGH RISK",
            "project": "Unknown",
            "location": "Unknown",
            "flags": [
                "❌ Credit ID not found in any major registry (Verra, Gold Standard, ACR)",
                "❌ Unregistered credits are a strong indicator of fabricated certificates",
                "⚠️ No project metadata available for cross-referencing"
            ],
            "summary": "This credit ID does not exist in any verified registry database. This is a critical red flag indicating a potentially fabricated carbon certificate."
        }

    prompt = f"""
You are a carbon credit fraud detection expert. Analyze this carbon credit and return ONLY a JSON object.

Credit ID: {credit_id}
Project: {registry_data['project']}
Location: {registry_data['location']}
Type: {registry_data['type']}
Issuer: {registry_data['issuer']}
Credits Issued: {registry_data['credits_issued']:,}
Baseline Credits: {registry_data['baseline_credits']:,}
Satellite Deforestation in Project Zone: {registry_data['satellite_deforestation_pct']}%
Cross-Registry Conflicts: {registry_data['cross_registry_conflicts']}
Issuer Historical Flags: {registry_data['issuer_flags']}

Return ONLY this JSON, no other text:
{{
  "riskScore": <integer 0-100>,
  "status": <"LOW RISK" | "MEDIUM RISK" | "HIGH RISK">,
  "flags": [<3-5 strings, each starting with ❌ or ⚠️ or ✅>],
  "summary": "<2-3 sentence verdict>"
}}

Scoring:
- Credits issued > 150% of baseline = +30
- Deforestation > 20% = +25
- Cross-registry conflicts > 1 = +20 each (max +40)
- Issuer flags > 0 = +15 each (max +30)
- 0-30 = LOW RISK, 31-65 = MEDIUM RISK, 66-100 = HIGH RISK
"""

    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.1
    )

    raw = response.choices[0].message.content.strip()
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]

    result = json.loads(raw.strip())
    result["creditId"] = credit_id
    result["project"] = registry_data["project"]
    result["location"] = registry_data["location"]
    result["issuer"] = registry_data["issuer"]
    result["creditsIssued"] = registry_data["credits_issued"]
    return result
