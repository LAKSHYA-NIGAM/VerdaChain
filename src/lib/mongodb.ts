// MongoDB has been replaced by Neon DB (PostgreSQL) + Drizzle ORM.
// This file is intentionally kept as a stub to avoid breaking any
// lingering imports. Use src/lib/db.ts for all database operations.

export async function connectDB(): Promise<never> {
  throw new Error(
    "[VerdaChain] MongoDB has been removed. Use insertVerification / getVerifications from @/lib/db instead."
  );
}

export function isDBConnected(): boolean {
  return false;
}
