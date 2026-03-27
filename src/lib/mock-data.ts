// ─── Verification Results ─────────────────────────────────────────────────────

export interface RiskFlag {
  icon: "alert-triangle" | "satellite" | "database" | "shield-alert" | "file-warning";
  label: string;
  severity: "high" | "medium" | "low";
}

export interface ProjectMetadata {
  projectName: string;
  registry: string;
  location: string;
  creditsIssued: number;
  vintage: string;
  methodology: string;
}

export interface BlockchainProof {
  txHash: string;
  timestamp: string;
  blockNumber: number;
  network: string;
}

export interface VerificationResult {
  creditId: string;
  riskScore: number;
  status: "High Risk" | "Medium Risk" | "Low Risk";
  riskFlags: RiskFlag[];
  metadata: ProjectMetadata;
  blockchain: BlockchainProof;
}

export const verificationResults: Record<string, VerificationResult> = {
  "VCU-12345": {
    creditId: "VCU-12345",
    riskScore: 78,
    status: "High Risk",
    riskFlags: [
      { icon: "alert-triangle", label: "Duplicate credit detected across Verra & Gold Standard registries", severity: "high" },
      { icon: "satellite", label: "Satellite imagery shows 23% deforestation mismatch in project area", severity: "high" },
      { icon: "database", label: "Registry inconsistency: credit issuance date predates project validation", severity: "medium" },
      { icon: "shield-alert", label: "Additionality claim flagged — baseline emissions appear inflated", severity: "high" },
    ],
    metadata: {
      projectName: "Amazon Rainforest Conservation Initiative",
      registry: "Verra (VCS)",
      location: "Amazonas, Brazil",
      creditsIssued: 145000,
      vintage: "2023",
      methodology: "VM0015 — Avoided Unplanned Deforestation",
    },
    blockchain: {
      txHash: "0x7a3b...9f2e",
      timestamp: "2024-01-15T14:32:00Z",
      blockNumber: 18924537,
      network: "Ethereum Mainnet",
    },
  },
  "GS-67890": {
    creditId: "GS-67890",
    riskScore: 22,
    status: "Low Risk",
    riskFlags: [
      { icon: "file-warning", label: "Minor documentation gap: MRV report pending Q4 2024 update", severity: "low" },
    ],
    metadata: {
      projectName: "Gujarat Solar Cookstove Distribution",
      registry: "Gold Standard",
      location: "Gujarat, India",
      creditsIssued: 35000,
      vintage: "2024",
      methodology: "GS-TPDDTEC — Technologies and Practices to Displace Decentralized Thermal Energy",
    },
    blockchain: {
      txHash: "0x2d8f...c41a",
      timestamp: "2024-03-08T09:15:00Z",
      blockNumber: 19203811,
      network: "Ethereum Mainnet",
    },
  },
  "ACR-11223": {
    creditId: "ACR-11223",
    riskScore: 45,
    status: "Medium Risk",
    riskFlags: [
      { icon: "satellite", label: "Satellite data: reforestation coverage is 15% below claimed area", severity: "medium" },
      { icon: "database", label: "Registry listing shows credit retirement inconsistencies", severity: "medium" },
    ],
    metadata: {
      projectName: "Pacific Northwest Reforestation Project",
      registry: "American Carbon Registry (ACR)",
      location: "Oregon, USA",
      creditsIssued: 82000,
      vintage: "2023",
      methodology: "ACR Reforestation Methodology v2.1",
    },
    blockchain: {
      txHash: "0x91c4...e827",
      timestamp: "2024-02-22T16:48:00Z",
      blockNumber: 19058294,
      network: "Ethereum Mainnet",
    },
  },
};

// Generate a fallback result for unknown IDs
export function getVerificationResult(id: string): VerificationResult {
  const upper = id.toUpperCase();
  if (verificationResults[upper]) return verificationResults[upper];

  // Generate a random-ish result based on the ID string
  const hash = upper.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const score = (hash * 7 + 31) % 101;
  const status: VerificationResult["status"] =
    score <= 30 ? "Low Risk" : score <= 60 ? "Medium Risk" : "High Risk";

  return {
    creditId: upper,
    riskScore: score,
    status,
    riskFlags: [
      { icon: "alert-triangle", label: "Unable to cross-reference with known registries", severity: score > 60 ? "high" : "medium" },
      { icon: "database", label: "Limited historical data available for this credit ID", severity: "medium" },
    ],
    metadata: {
      projectName: "Unknown Project",
      registry: "Unverified",
      location: "Not Available",
      creditsIssued: 0,
      vintage: "N/A",
      methodology: "N/A",
    },
    blockchain: {
      txHash: `0x${upper.replace(/[^a-f0-9]/gi, "").padEnd(8, "0").slice(0, 4)}...${Date.now().toString(16).slice(-4)}`,
      timestamp: new Date().toISOString(),
      blockNumber: 19000000 + (hash % 500000),
      network: "Ethereum Mainnet",
    },
  };
}

// ─── Audit Logs ───────────────────────────────────────────────────────────────

export interface AuditLog {
  id: string;
  creditId: string;
  riskScore: number;
  status: "High Risk" | "Medium Risk" | "Low Risk";
  timestamp: string;
  verifier: string;
  projectName: string;
  registry: string;
}

export const auditLogs: AuditLog[] = [
  { id: "1", creditId: "VCU-12345", riskScore: 78, status: "High Risk", timestamp: "2024-03-25T14:32:00Z", verifier: "0x7a3b...9f2e", projectName: "Amazon Rainforest Conservation", registry: "Verra" },
  { id: "2", creditId: "GS-67890", riskScore: 22, status: "Low Risk", timestamp: "2024-03-24T09:15:00Z", verifier: "0x2d8f...c41a", projectName: "Gujarat Solar Cookstove", registry: "Gold Standard" },
  { id: "3", creditId: "ACR-11223", riskScore: 45, status: "Medium Risk", timestamp: "2024-03-23T16:48:00Z", verifier: "0x91c4...e827", projectName: "Pacific Northwest Reforestation", registry: "ACR" },
  { id: "4", creditId: "VCU-44221", riskScore: 91, status: "High Risk", timestamp: "2024-03-22T11:20:00Z", verifier: "0xb2e1...3d7f", projectName: "Congo Basin REDD+", registry: "Verra" },
  { id: "5", creditId: "GS-55443", riskScore: 12, status: "Low Risk", timestamp: "2024-03-21T08:05:00Z", verifier: "0xc4a9...5e12", projectName: "Kenya Clean Water Project", registry: "Gold Standard" },
  { id: "6", creditId: "VCU-78901", riskScore: 55, status: "Medium Risk", timestamp: "2024-03-20T19:30:00Z", verifier: "0xd7f2...8a91", projectName: "Borneo Peatland Restoration", registry: "Verra" },
  { id: "7", creditId: "CAR-33210", riskScore: 67, status: "High Risk", timestamp: "2024-03-19T13:45:00Z", verifier: "0xe1b3...2c4d", projectName: "California Forest Offset", registry: "CAR" },
  { id: "8", creditId: "GS-99012", riskScore: 8, status: "Low Risk", timestamp: "2024-03-18T07:12:00Z", verifier: "0xf5d8...7e23", projectName: "Rwanda Biogas Programme", registry: "Gold Standard" },
  { id: "9", creditId: "VCU-66789", riskScore: 34, status: "Medium Risk", timestamp: "2024-03-17T15:55:00Z", verifier: "0xa8c2...1b56", projectName: "Indonesian Mangrove Protection", registry: "Verra" },
  { id: "10", creditId: "ACR-22345", riskScore: 72, status: "High Risk", timestamp: "2024-03-16T10:28:00Z", verifier: "0xb9d4...6f89", projectName: "Texas Grassland Conservation", registry: "ACR" },
  { id: "11", creditId: "VCU-11234", riskScore: 19, status: "Low Risk", timestamp: "2024-03-15T12:40:00Z", verifier: "0xc3e7...9a12", projectName: "Yunnan Forest Conservation", registry: "Verra" },
  { id: "12", creditId: "GS-88765", riskScore: 52, status: "Medium Risk", timestamp: "2024-03-14T16:20:00Z", verifier: "0xd6f1...4c78", projectName: "Nepal Improved Cookstoves", registry: "Gold Standard" },
];

// ─── Analytics Data ───────────────────────────────────────────────────────────

export const riskDistribution = [
  { range: "0–10", count: 4, fill: "#10b981" },
  { range: "11–20", count: 7, fill: "#10b981" },
  { range: "21–30", count: 5, fill: "#34d399" },
  { range: "31–40", count: 3, fill: "#fbbf24" },
  { range: "41–50", count: 6, fill: "#fbbf24" },
  { range: "51–60", count: 4, fill: "#f97316" },
  { range: "61–70", count: 8, fill: "#ef4444" },
  { range: "71–80", count: 5, fill: "#ef4444" },
  { range: "81–90", count: 3, fill: "#dc2626" },
  { range: "91–100", count: 2, fill: "#dc2626" },
];

export const verificationTrends = [
  { month: "Oct", verified: 34, flagged: 12 },
  { month: "Nov", verified: 42, flagged: 15 },
  { month: "Dec", verified: 51, flagged: 18 },
  { month: "Jan", verified: 63, flagged: 22 },
  { month: "Feb", verified: 78, flagged: 19 },
  { month: "Mar", verified: 95, flagged: 28 },
];
