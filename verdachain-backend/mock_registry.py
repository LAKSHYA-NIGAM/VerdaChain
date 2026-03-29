REGISTRY_DATA = {
    "VCU-12345": {
        "project": "Amazon Rainforest Conservation",
        "location": "Brazil",
        "type": "REDD+",
        "issuer": "Verde Holdings Ltd",
        "credits_issued": 850000,
        "baseline_credits": 250000,
        "registry": "Verra",
        "satellite_deforestation_pct": 28,
        "cross_registry_conflicts": 2,
        "issuer_flags": 1
    },
    "GS-67890": {
        "project": "Gujarat Solar Cookstove",
        "location": "India",
        "type": "Clean Energy",
        "issuer": "SunClean India Pvt Ltd",
        "credits_issued": 12000,
        "baseline_credits": 15000,
        "registry": "Gold Standard",
        "satellite_deforestation_pct": 0,
        "cross_registry_conflicts": 0,
        "issuer_flags": 0
    },
    "VCU-44221": {
        "project": "Congo Basin REDD+",
        "location": "Democratic Republic of Congo",
        "type": "REDD+",
        "issuer": "ForestClaim International",
        "credits_issued": 2100000,
        "baseline_credits": 480000,
        "registry": "Verra",
        "satellite_deforestation_pct": 34,
        "cross_registry_conflicts": 3,
        "issuer_flags": 3
    },
    "ACR-11223": {
        "project": "Pacific Northwest Reforestation",
        "location": "USA",
        "type": "Reforestation",
        "issuer": "Pacific Green Corp",
        "credits_issued": 95000,
        "baseline_credits": 80000,
        "registry": "ACR",
        "satellite_deforestation_pct": 5,
        "cross_registry_conflicts": 1,
        "issuer_flags": 0
    },
    "GS-55443": {
        "project": "Kenya Clean Water Project",
        "location": "Kenya",
        "type": "Clean Water",
        "issuer": "AquaLife Africa",
        "credits_issued": 8000,
        "baseline_credits": 10000,
        "registry": "Gold Standard",
        "satellite_deforestation_pct": 0,
        "cross_registry_conflicts": 0,
        "issuer_flags": 0
    }
}

def get_credit_data(credit_id: str):
    return REGISTRY_DATA.get(credit_id.upper(), None)
