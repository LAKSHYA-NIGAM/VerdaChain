"""
VerdaChain - Carbon Credit Risk Verification Unit Tests
-------------------------------------------------------
Validates heuristic risk scoring, registry lookup, and anomaly flags.
"""
import os
import sys
import unittest

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
if CURRENT_DIR not in sys.path:
    sys.path.insert(0, CURRENT_DIR)

from mock_registry import get_credit_data, REGISTRY_DATA
from verifier import analyze_credit


class VerdaChainVerifierTestCase(unittest.TestCase):
    def setUp(self):
        # Force deterministic fallback mode
        if "OPENAI_API_KEY" in os.environ:
            del os.environ["OPENAI_API_KEY"]

    def test_01_unknown_credit_returns_critical_risk(self):
        """Verify unlisted credit yields 95 risk score and HIGH RISK status."""
        result = analyze_credit("UNKNOWN-999")
        self.assertEqual(result["riskScore"], 95)
        self.assertEqual(result["status"], "HIGH RISK")
        self.assertEqual(result["project"], "Unknown")
        self.assertGreater(len(result["flags"]), 0)

    def test_02_known_high_risk_credit_evaluation(self):
        """Verify VCU-12345 (overissued + deforestation) is categorized as HIGH RISK."""
        result = analyze_credit("VCU-12345")
        self.assertEqual(result["creditId"], "VCU-12345")
        self.assertGreaterEqual(result["riskScore"], 66)
        self.assertEqual(result["status"], "HIGH RISK")
        self.assertEqual(result["project"], "Amazon Rainforest Conservation")
        # Check flags detected overissuance and deforestation
        flags_text = " ".join(result["flags"])
        self.assertIn("Credits issued exceed baseline", flags_text)
        self.assertIn("Deforestation", flags_text)

    def test_03_known_low_risk_credit_evaluation(self):
        """Verify GS-67890 (clean cookstove with 0 deforestation) is categorized as LOW RISK."""
        result = analyze_credit("GS-67890")
        self.assertEqual(result["creditId"], "GS-67890")
        self.assertLessEqual(result["riskScore"], 30)
        self.assertEqual(result["status"], "LOW RISK")
        self.assertEqual(result["location"], "India")

    def test_04_congo_basin_heavy_fraud_flags(self):
        """Verify VCU-44221 with massive conflict count triggers max risk."""
        result = analyze_credit("VCU-44221")
        self.assertEqual(result["status"], "HIGH RISK")
        self.assertGreaterEqual(result["riskScore"], 80)
        self.assertEqual(result["issuer"], "ForestClaim International")

    def test_05_mock_registry_data_integrity(self):
        """Verify mock registry contains valid schema for all entries."""
        for credit_id, entry in REGISTRY_DATA.items():
            self.assertIn("project", entry)
            self.assertIn("location", entry)
            self.assertIn("type", entry)
            self.assertIn("issuer", entry)
            self.assertIn("credits_issued", entry)
            self.assertIn("baseline_credits", entry)
            self.assertGreater(entry["credits_issued"], 0)


if __name__ == "__main__":
    unittest.main(verbosity=2)
