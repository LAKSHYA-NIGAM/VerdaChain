import { keccak256, toUtf8Bytes } from "ethers";

/**
 * Generate a realistic Ethereum-style transaction hash
 * by hashing creditId + timestamp using keccak256.
 */
export function generateTxHash(creditId: string): string {
  const payload = `${creditId}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const hash = keccak256(toUtf8Bytes(payload));
  return hash; // returns full 0x... hash
}
