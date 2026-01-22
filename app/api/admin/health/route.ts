import { NextResponse } from "next/server";
import { db } from "@/db";
import { sql } from "drizzle-orm";
import { users, institutions, blogPosts } from "@/db/schema";
import { redis } from "@/lib/redis";
import { requireAuth } from "@/lib/auth";
import { RoleGuard } from "@/lib/utils/roles";

export const dynamic = "force-dynamic";

export async function GET() {
  const { user } = await requireAuth();
  await RoleGuard.requireRole(user.id, "PLATFORM_ADMIN");

  const diagnostics = {
    system: {
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      nodeVersion: process.version,
      platform: process.platform,
    },
    database: {
      status: "unknown" as "unknown" | "connected" | string,
      latency: 0,
      counts: {
        users: 0,
        institutions: 0,
        posts: 0,
      },
    },
    redis: {
      status: "unknown" as "unknown" | "connected" | string,
      info: {} as {
        keys?: number;
        latency?: number;
        provider?: string;
      },
    },
    timestamp: new Date().toISOString(),
  };

  // 2. Database Deep Check
  try {
    const dbStart = performance.now();
    await db.execute(sql`SELECT 1`);
    diagnostics.database.latency = Math.round(performance.now() - dbStart);
    diagnostics.database.status = "connected";

    const [uCount, iCount, pCount] = await Promise.all([
      db.select({ count: sql<number>`count(*)` }).from(users),
      db.select({ count: sql<number>`count(*)` }).from(institutions),
      db.select({ count: sql<number>`count(*)` }).from(blogPosts),
    ]);

    diagnostics.database.counts.users = Number(uCount[0]?.count || 0);
    diagnostics.database.counts.institutions = Number(iCount[0]?.count || 0);
    diagnostics.database.counts.posts = Number(pCount[0]?.count || 0);
  } catch (error: any) {
    diagnostics.database.status = `error: ${error.message}`;
  }

  // 3. Redis Deep Check (Upstash-compatible)
  if (redis) {
    try {
      const start = performance.now();
      const keys = await redis.dbsize();

      diagnostics.redis.status = "connected";
      diagnostics.redis.info = {
        keys,
        latency: Math.round(performance.now() - start),
        provider: "upstash",
      };
    } catch (error: any) {
      diagnostics.redis.status = `error: ${error.message}`;
      diagnostics.redis.info = {};
    }
  } else {
    diagnostics.redis.status = "not_configured";
  }

  return NextResponse.json(diagnostics);
}
