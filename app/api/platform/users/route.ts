// app/api/platform/users/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users, userRoles } from "@/db/schema";
import { requireAuth } from "@/lib/auth";
import { RoleGuard } from "@/lib/utils/roles";
import { eq, and, count, SQL, sql } from "drizzle-orm";
import { z } from "zod";
import { ApiResponses } from "@/lib/api-response";

// Zod schema for validating query parameters
const querySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  query: z.string().optional(), // A general query for name or email
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
    const whereClauses: (SQL | undefined)[] = [
      query
        ? sql`(${users.name} ILIKE ${`%${query}%`} OR ${
            users.email
          } ILIKE ${`%${query}%`})`
        : undefined,
    ];
    const finalWhere = and(...whereClauses.filter((c): c is SQL => !!c));

    // --- Database Fetch (in parallel) ---
    const [data, total] = await Promise.all([
      db
        .select({
          id: users.id,
          name: users.name,
          email: users.email,
          image: users.image,
          emailVerified: users.emailVerified,
          createdAt: users.createdAt,
          roles: sql<string[]>`
            COALESCE(
              (
                SELECT json_agg(${userRoles.role})
                FROM ${userRoles}
                WHERE ${userRoles.userId} = ${users.id}
              ),
              '[]'::json
            )
          `.as('roles'),
        })
        .from(users)
        // .leftJoin(userRoles, eq(users.id, userRoles.userId))
        .where(finalWhere)
        // .groupBy(users.id)
        .orderBy(sql`${users.createdAt} DESC`)
        .limit(limit)
        .offset(offset),

      db.select({ value: count() }).from(users).where(finalWhere),
    ]);

    const totalResults = total[0].value;
    const totalPages = Math.ceil(totalResults / limit);

    // --- Response ---
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
