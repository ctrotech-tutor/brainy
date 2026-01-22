import { NextResponse } from "next/server";
import { db } from "@/db";
import { sql } from "drizzle-orm";
import nodemailer from "nodemailer";
import { users } from "@/db/schema";
import { redis } from "@/lib/redis";

export const dynamic = "force-dynamic";

export async function GET() {
  const start = performance.now();
  const status = {
    database: "outage",
    auth: "outage",
    email: "outage",
    ai: "outage",
    storage: "outage",
    uptime: process.uptime(),
    latency: 0,
    history: [] as number[],
    timestamp: new Date().toISOString(),
  };

  // 1. Database Check
  try {
    await db.execute(sql`SELECT 1`);
    status.database = "operational";
  } catch (error) {
    console.error("Database check failed:", error);
    status.database = "outage";
  }

  // 2. Auth Service Check
  try {
    if (status.database === "operational") {
        await db.select().from(users).limit(1);
        status.auth = "operational";
    } else {
        status.auth = "outage";
    }
  } catch (error) {
    console.error("Auth check failed:", error);
    status.auth = "degraded";
  }

  // 3. Email Service
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
    await new Promise((resolve, reject) => {
        transporter.verify(function (error, success) {
            if (error) {
                reject(error);
            } else {
                resolve(success);
            }
        });
    });
    status.email = "operational";
  } catch (error) {
    console.error("Email check failed:", error);
    status.email = "outage";
  }

  // 4. AI Engine
  if (process.env.OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY || process.env.GEMINI_API_KEY) {
      status.ai = "operational";
  } else {
      status.ai = "degraded";
  }

  // 5. Storage
  if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY) {
      status.storage = "operational";
  } else {
      status.storage = "degraded";
  }

  const end = performance.now();
  status.latency = Math.round(end - start);

  // 6. Redis History (Global Latency)
  if (redis) {
      try {
          // Push current latency to list
          await redis.lpush("latency_history", status.latency);
          // Keep only last 40 items
          await redis.ltrim("latency_history", 0, 39);
          // Fetch history
          status.history = await redis.lrange("latency_history", 0, 39) as number[];
          // Reverse because lpush/lrange gives newest first, but graph wants oldest -> newest usually
          // Actually graph mapping usually expects index 0 to be left?
          // If we map simply, we'll handle direction in client.
      } catch (error) {
          console.error("Redis error:", error);
          // status.history remains empty, client handles graceful degradation
      }
  }

  return NextResponse.json(status);
}
