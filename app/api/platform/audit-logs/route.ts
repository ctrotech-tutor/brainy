// app/api/platform/audit-logs/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { auditLogs, users } from "@/db/schema";
import { requireAuth } from "@/lib/auth";
import { RoleGuard } from "@/lib/utils/roles";
import { eq, and, count, SQL, sql, desc } from "drizzle-orm";
import { z } from "zod";
import { ApiResponses } from "@/lib/api-response";

// Zod schema for validating query parameters
const querySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20), // Default to 20 for logs
  query: z.string().optional(), // General query for action or actor name/email
});

export async function GET(req: NextRequest) {
  try {
    // --- Authorization ---
    const { user } = await requireAuth();
    await RoleGuard.requireRole(user.id, "PLATFORM_ADMIN");

    // --- Input Validation ---
    const searchParams = req.nextUrl.searchParams;
    const rawQuery = Object.fromEntries(searchParams.entries());
    const validation = querySchema.safeParse(rawQuery);

    if (!validation.success) {
      return ApiResponses.validationError(validation.error.issues);
    }

    const { page, limit, query } = validation.data;
    const offset = (page - 1) * limit;

    // --- Dynamic Query Construction ---
    // We will search in the action itself, or in the actor's name/email
    const whereClauses: (SQL | undefined)[] = [
      query
        ? sql`(${auditLogs.action} ILIKE ${`%${query}%`} OR ${users.name} ILIKE ${`%${query}%`} OR ${users.email} ILIKE ${`%${query}%`})`
        : undefined,
    ];
    const finalWhere = and(...whereClauses.filter((c): c is SQL => !!c));

    // --- Database Fetch (in parallel) ---
    const [data, total] = await Promise.all([
      // Main data query with join to get actor details
      db
        .select({
          id: auditLogs.id,
          action: auditLogs.action,
          resourceId: auditLogs.resourceId,
          resourceTable: auditLogs.resourceTable,
          payload: auditLogs.payload,
          createdAt: auditLogs.createdAt,
          actor: {
            id: users.id,
            name: users.name,
            email: users.email,
          },
        })
        .from(auditLogs)
        .leftJoin(users, eq(auditLogs.actorId, users.id)) // Join to get the actor's info
        .where(finalWhere)
        .orderBy(desc(auditLogs.createdAt)) // Order by most recent first
        .limit(limit)
        .offset(offset),
      
      // Count query for pagination
      // We need to join here as well to filter by actor
      db
        .select({ value: count() })
        .from(auditLogs)
        .leftJoin(users, eq(auditLogs.actorId, users.id))
        .where(finalWhere),
    ]);

    const totalResults = total[0].value;
    const totalPages = Math.ceil(totalResults / limit);

    // --- Response ---
    return ApiResponses.success({
      data,
      pagination: {
        currentPage: page,
        totalPages,
        totalResults,
        limit,
      },
    });

  } catch (error) {
    return ApiResponses.handleError(error);
  }
}
