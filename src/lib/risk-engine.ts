/**
 * VerdaChain Risk Scoring Engine
 *
 * Generates realistic, deterministic-ish risk scores and contextual flags
 * based on credit ID patterns, registry type, and project metadata.
 */

import type { CreditMetadata } from "@/lib/types";

// ─── Risk Flag Definitions by Category ──────────────────────────────────────

interface FlagDefinition {
  label: string;
  severity: "high" | "medium" | "low";
  /** Weight added to risk score when this flag is triggered */
  weight: number;
}

const REGISTRY_FLAGS: FlagDefinition[] = [
  { label: "Duplicate credit detected across multiple registries", severity: "high", weight: 18 },
  { label: "Registry inconsistency: credit issuance date predates project validation", severity: "high", weight: 15 },
  { label: "Cross-registry duplicate check returned inconclusive results", severity: "medium", weight: 8 },
  { label: "Registry listing shows credit retirement inconsistencies", severity: "medium", weight: 10 },
  { label: "Vintage year inconsistency across linked credit batches", severity: "medium", weight: 7 },
];

const SATELLITE_FLAGS: FlagDefinition[] = [
  { label: "Satellite imagery shows significant deforestation mismatch in project area", severity: "high", weight: 20 },
  { label: "NDVI analysis indicates 30%+ vegetation cover decline since baseline", severity: "high", weight: 16 },
  { label: "Satellite data: reforestation coverage is below claimed project area", severity: "medium", weight: 12 },
  { label: "Temporal satellite comparison shows boundary discrepancy", severity: "medium", weight: 9 },
  { label: "Cloud cover in recent satellite pass — verification pending re-scan", severity: "low", weight: 3 },
];

const METHODOLOGY_FLAGS: FlagDefinition[] = [
  { label: "Additionality claim flagged — baseline emissions appear inflated by 40%+", severity: "high", weight: 17 },
  { label: "MRV report shows discrepancy in emission reduction calculations", severity: "medium", weight: 11 },
  { label: "Methodology version mismatch with current registry standards", severity: "medium", weight: 8 },
  { label: "Leakage assessment incomplete — upstream emissions not accounted for", severity: "medium", weight: 10 },
  { label: "Permanence risk: project lacks 100-year sequestration guarantee", severity: "low", weight: 5 },
];

const AUDIT_FLAGS: FlagDefinition[] = [
  { label: "Third-party audit certification expired — renewal pending", severity: "medium", weight: 9 },
  { label: "Verification body accreditation under review by ISEAL Alliance", severity: "medium", weight: 7 },
  { label: "Minor documentation gap: MRV report pending quarterly update", severity: "low", weight: 3 },
  { label: "Project boundary overlap detected with adjacent conservation zone", severity: "low", weight: 4 },
  { label: "Stakeholder consultation records incomplete for Indigenous communities", severity: "medium", weight: 8 },
];

const PROJECT_FLAGS: FlagDefinition[] = [
  { label: "Project developer has been flagged in 2 other credit investigations", severity: "high", weight: 19 },
  { label: "Financial additionality questionable — project was commercially viable pre-credits", severity: "high", weight: 14 },
  { label: "Limited historical data available for this credit ID", severity: "medium", weight: 6 },
  { label: "Co-benefits claims (biodiversity) lack independent verification", severity: "low", weight: 4 },
  { label: "Buffer pool contribution below recommended threshold", severity: "low", weight: 5 },
];

// ─── Deterministic hash for consistent scoring per credit ID ────────────────

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const chr = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

/**
 * Seeded pseudo-random number generator (Mulberry32)
 * Gives consistent results for the same seed.
 */
function seededRandom(seed: number): () => number {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ─── Known Credit Profiles ──────────────────────────────────────────────────

interface CreditProfile {
  metadata: CreditMetadata;
  baseRiskScore: number;
  fixedFlags: FlagDefinition[];
}

const KNOWN_PROFILES: Record<string, CreditProfile> = {
  "VCU-12345": {
    metadata: {
      projectName: "Amazon Rainforest Conservation Initiative",
      registry: "Verra (VCS)",
      location: "Amazonas, Brazil",
      issuedCredits: 145000,
    },
    baseRiskScore: 78,
    fixedFlags: [
      { label: "Duplicate credit detected across Verra & Gold Standard registries", severity: "high", weight: 18 },
      { label: "Satellite imagery shows 23% deforestation mismatch in project area", severity: "high", weight: 20 },
      { label: "Additionality claim flagged — baseline emissions appear inflated by 40%+", severity: "high", weight: 17 },
      { label: "Project developer has been flagged in 2 other credit investigations", severity: "high", weight: 19 },
    ],
  },
  "GS-67890": {
    metadata: {
      projectName: "Gujarat Solar Cookstove Distribution",
      registry: "Gold Standard",
      location: "Gujarat, India",
      issuedCredits: 35000,
    },
    baseRiskScore: 22,
    fixedFlags: [
      { label: "Minor documentation gap: MRV report pending quarterly update", severity: "low", weight: 3 },
    ],
  },
  "ACR-11223": {
    metadata: {
      projectName: "Pacific Northwest Reforestation Project",
      registry: "American Carbon Registry (ACR)",
      location: "Oregon, USA",
      issuedCredits: 82000,
    },
    baseRiskScore: 45,
    fixedFlags: [
      { label: "Satellite data: reforestation coverage is below claimed project area", severity: "medium", weight: 12 },
      { label: "Registry listing shows credit retirement inconsistencies", severity: "medium", weight: 10 },
    ],
  },
};

// ─── Risk Engine ─────────────────────────────────────────────────────────────

export interface RiskResult {
  riskScore: number;
  status: "High Risk" | "Medium Risk" | "Low Risk";
  flags: string[];
  metadata: CreditMetadata;
}

/**
 * Analyze a carbon credit and return risk score, flags, status, and metadata.
 *
 * - Known credit IDs return deterministic, realistic results.
 * - Unknown IDs generate consistent results based on the ID hash,
 *   selecting flags from multiple categories weighted by the score.
 */
export function analyzeCredit(creditId: string): RiskResult {
  const id = creditId.toUpperCase();

  // ── Known profiles return fixed results ──
  if (KNOWN_PROFILES[id]) {
    const profile = KNOWN_PROFILES[id];
    return {
      riskScore: profile.baseRiskScore,
      status: scoreToStatus(profile.baseRiskScore),
      flags: profile.fixedFlags.map((f) => f.label),
      metadata: profile.metadata,
    };
  }

  // ── Generate deterministic results for unknown IDs ──
  const seed = hashCode(id);
  const rand = seededRandom(seed);

  // Determine registry type from ID prefix for contextual flag selection
  const prefix = id.split("-")[0] || "";
  const registryHint = getRegistryHint(prefix);

  // Base score influenced by ID characteristics
  const baseScore = Math.floor(rand() * 71) + 20; // 20–90

  // Select flags based on risk level
  const allFlags = [...REGISTRY_FLAGS, ...SATELLITE_FLAGS, ...METHODOLOGY_FLAGS, ...AUDIT_FLAGS, ...PROJECT_FLAGS];

  // Higher risk = more flags, weighted toward severe ones
  let flagCount: number;
  if (baseScore >= 70) {
    flagCount = 3 + Math.floor(rand() * 2); // 3–4 flags
  } else if (baseScore >= 40) {
    flagCount = 2 + Math.floor(rand() * 2); // 2–3 flags
  } else {
    flagCount = 1 + Math.floor(rand() * 1); // 1 flag
  }

  // Pick flags deterministically using seeded random
  const selectedFlags: FlagDefinition[] = [];
  const available = [...allFlags];

  // Weight selection: high-risk IDs more likely to get severe flags
  for (let i = 0; i < flagCount && available.length > 0; i++) {
    // Sort by relevance: prefer high-severity flags for high-risk scores
    if (baseScore >= 60) {
      available.sort((a, b) => {
        const sevOrder = { high: 0, medium: 1, low: 2 };
        return sevOrder[a.severity] - sevOrder[b.severity];
      });
    }

    const idx = Math.floor(rand() * Math.min(available.length, baseScore >= 60 ? 8 : available.length));
    selectedFlags.push(available[idx]);
    available.splice(idx, 1);
  }

  // Adjust final score slightly based on total flag weights
  const totalWeight = selectedFlags.reduce((sum, f) => sum + f.weight, 0);
  const weightFactor = Math.min(totalWeight / 50, 1); // Normalize
  const adjustedScore = Math.min(95, Math.max(15, Math.round(baseScore * 0.7 + weightFactor * 30)));

  return {
    riskScore: adjustedScore,
    status: scoreToStatus(adjustedScore),
    flags: selectedFlags.map((f) => f.label),
    metadata: generateMetadata(id, prefix, registryHint, rand),
  };
}

/**
 * Get metadata for a known credit, or null if unknown.
 */
export function getKnownMetadata(creditId: string): CreditMetadata | null {
  const profile = KNOWN_PROFILES[creditId.toUpperCase()];
  return profile ? profile.metadata : null;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function scoreToStatus(score: number): "High Risk" | "Medium Risk" | "Low Risk" {
  if (score <= 30) return "Low Risk";
  if (score <= 60) return "Medium Risk";
  return "High Risk";
}

function getRegistryHint(prefix: string): string {
  const map: Record<string, string> = {
    VCU: "Verra (VCS)",
    GS: "Gold Standard",
    ACR: "American Carbon Registry (ACR)",
    CAR: "Climate Action Reserve",
    CDM: "Clean Development Mechanism",
    JCM: "Joint Crediting Mechanism",
  };
  return map[prefix] || "Unverified Registry";
}

function generateMetadata(
  id: string,
  prefix: string,
  registry: string,
  rand: () => number
): CreditMetadata {
  const projectNames = [
    "Tropical Forest Conservation Project",
    "Renewable Energy Development Initiative",
    "Sustainable Agriculture Carbon Program",
    "Wetland Restoration & Blue Carbon Project",
    "Community Biogas Distribution Scheme",
    "Mangrove Ecosystem Preservation",
    "Wind Farm Carbon Offset Program",
    "Improved Cookstove Distribution",
    "Peatland Rewetting Initiative",
    "Agroforestry Carbon Sequestration",
  ];

  const locations = [
    "Para, Brazil",
    "Karnataka, India",
    "Central Kalimantan, Indonesia",
    "Nairobi, Kenya",
    "Yunnan, China",
    "Mato Grosso, Brazil",
    "Accra, Ghana",
    "Sumatra, Indonesia",
    "Chiapas, Mexico",
    "Mekong Delta, Vietnam",
  ];

  const nameIdx = Math.floor(rand() * projectNames.length);
  const locIdx = Math.floor(rand() * locations.length);
  const credits = (Math.floor(rand() * 180) + 20) * 1000; // 20k–200k

  return {
    projectName: projectNames[nameIdx],
    registry,
    location: locations[locIdx],
    issuedCredits: credits,
  };
}
