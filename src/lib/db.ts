import { desc } from "drizzle-orm";
import { db } from "./neon";
import { verifications } from "./schema";
import type { NewVerification, Verification } from "./schema";

/**
 * Insert a new verification record into Neon DB.
 */
export async function insertVerification(
  data: NewVerification
): Promise<Verification> {
  const [record] = await db.insert(verifications).values(data).returning();
  return record;
}

/**
 * Fetch the most recent verification records (newest first).
 */
export async function getVerifications(limit = 100): Promise<Verification[]> {
  return db
    .select()
    .from(verifications)
    .orderBy(desc(verifications.createdAt))
    .limit(limit);
}

/**
 * Check if the DB is reachable (used in health checks / diagnostics).
 */
export async function isDBConnected(): Promise<boolean> {
  try {
    await db.select().from(verifications).limit(1);
    return true;
  } catch {
    return false;
  }
}
