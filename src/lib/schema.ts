import { pgTable, serial, text, real, integer, timestamp } from "drizzle-orm/pg-core";

/**
 * Drizzle ORM schema for Neon DB (PostgreSQL).
 * Replaces Mongoose models for VerdaChain.
 */
export const verifications = pgTable("verifications", {
  id: serial("id").primaryKey(),
  creditId: text("credit_id").notNull(),
  project: text("project").notNull(),
  location: text("location"),
  issuer: text("issuer"),
  riskScore: real("risk_score").notNull(),
  status: text("status").notNull(),
  flags: text("flags").array(),
  summary: text("summary"),
  resultHash: text("result_hash"),
  txHash: text("tx_hash"),
  creditsIssued: integer("credits_issued"),
  createdAt: timestamp("created_at").defaultNow(),
});

export type Verification = typeof verifications.$inferSelect;
export type NewVerification = typeof verifications.$inferInsert;
