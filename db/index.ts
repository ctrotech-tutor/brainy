// db/index.ts
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
import * as schema from "./schema";

// Required for WebSockets in Node.js environments (like Next.js Server Actions/API Routes)
if (typeof window === "undefined") {
  neonConfig.webSocketConstructor = ws;
}

// Ensure the DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}

/**
 * Single robust database instance using Neon Serverless (WebSockets).
 * This supports robust Postgres transactions (db.transaction()) across all 
 * server-side environments (Node.js and Edge).
 */
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export const db = drizzle(pool, { schema });

/**
 * Transaction helper to ensure consistent usage across the platform.
 */
export const tx = db.transaction.bind(db);