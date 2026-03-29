import * as dotenv from "dotenv";
import { defineConfig } from "drizzle-kit";

// drizzle-kit doesn't read .env.local by default (Next.js convention).
// We load it manually so DATABASE_URL is available during schema push.
dotenv.config({ path: ".env.local" });

export default defineConfig({
  schema: "./src/lib/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
    ssl: true,
  },
});
