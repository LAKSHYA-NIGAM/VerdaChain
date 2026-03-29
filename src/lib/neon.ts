import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL is not set. Please add your Neon connection string to .env.local"
  );
}

const sql = neon(process.env.DATABASE_URL);

/**
 * Drizzle ORM client connected to Neon DB.
 * Use this for all database operations in API routes.
 */
export const db = drizzle(sql, { schema });
