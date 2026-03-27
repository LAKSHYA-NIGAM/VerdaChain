/**
 * In-memory store for verifications when MongoDB is not available.
 * Data persists only for the lifetime of the server process.
 */

export interface InMemoryVerification {
  creditId: string;
  riskScore: number;
  status: "High Risk" | "Medium Risk" | "Low Risk";
  flags: string[];
  metadata: {
    projectName: string;
    registry: string;
    location: string;
    issuedCredits: number;
  };
  txHash: string;
  timestamp: Date;
}

declare global {
  // eslint-disable-next-line no-var
  var __verdachain_memory_store: InMemoryVerification[] | undefined;
}

export function getInMemoryStore(): InMemoryVerification[] {
  if (!global.__verdachain_memory_store) {
    global.__verdachain_memory_store = [];
  }
  return global.__verdachain_memory_store;
}
