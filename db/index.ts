// db/index.ts
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";

// Ensure the DATABASE_URL is set
if (!process.env.DATABASE_URL ) {
  throw new Error("DATABASE_URL environment variable is not set");
}

// Create the database client
const sql = neon(process.env.DATABASE_URL_POOLED!);

// Create the Drizzle instance, passing it the client and the schema
export const db = drizzle(sql, { schema });