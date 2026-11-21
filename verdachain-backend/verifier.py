import os
import json
from mock_registry import get_credit_data

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

    # Deterministic heuristic fallback when OpenAI is not configured or in testing
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        score = 10
        flags = []
        if registry_data['credits_issued'] > registry_data['baseline_credits'] * 1.5:
            score += 30
            flags.append("❌ Credits issued exceed baseline by over 50%")
        else:
            flags.append("✅ Credits issued align with baseline estimates")

        if registry_data['satellite_deforestation_pct'] > 20:
            score += 25
            flags.append(f"❌ Deforestation in project zone ({registry_data['satellite_deforestation_pct']}%) exceeds threshold")
        else:
            flags.append(f"✅ Deforestation rate ({registry_data['satellite_deforestation_pct']}%) within normal range")

        conflicts = registry_data.get('cross_registry_conflicts', 0)
        if conflicts > 1:
            score += min(40, conflicts * 20)
            flags.append(f"❌ Detected {conflicts} cross-registry conflicts")
        elif conflicts == 1:
            flags.append("⚠️ Single registry conflict detected")
        else:
            flags.append("✅ No cross-registry conflicts detected")

        issuer_flags = registry_data.get('issuer_flags', 0)
        if issuer_flags > 0:
            score += min(30, issuer_flags * 15)
            flags.append(f"⚠️ Issuer has {issuer_flags} historical registry flags")

        score = min(100, max(0, score))
        status = "LOW RISK" if score <= 30 else ("MEDIUM RISK" if score <= 65 else "HIGH RISK")

        return {
            "creditId": credit_id,
            "riskScore": score,
            "status": status,
            "project": registry_data["project"],
            "location": registry_data["location"],
            "issuer": registry_data["issuer"],
            "creditsIssued": registry_data["credits_issued"],
            "flags": flags,
            "summary": f"Automated risk evaluation completed with composite risk score of {score}/100 ({status})."
        }

    from openai import OpenAI
    client = OpenAI(api_key=api_key)

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
