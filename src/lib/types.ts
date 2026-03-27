// ─── API Types ────────────────────────────────────────────────────────────────

export interface VerifyRequest {
  creditId: string;
}

export interface CreditMetadata {
  projectName: string;
  registry: string;
  location: string;
  issuedCredits: number;
}

export interface VerifyResponse {
  creditId: string;
  riskScore: number;
  status: "High Risk" | "Medium Risk" | "Low Risk";
  flags: string[];
  metadata: CreditMetadata;
  txHash: string;
  timestamp: string;
}

export interface VerificationRecord {
  _id?: string;
  creditId: string;
  riskScore: number;
  status: "High Risk" | "Medium Risk" | "Low Risk";
  flags: string[];
  metadata: CreditMetadata;
  txHash: string;
  timestamp: Date | string;
}
