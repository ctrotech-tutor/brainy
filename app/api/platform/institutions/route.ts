// app/api/platform/institutions/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { institutions, institutionStatusEnum } from "@/db/schema"; // 1. Import the enum
import { requireAuth } from "@/lib/auth";
import { RoleGuard } from "@/lib/utils/roles";
import { eq, and, ilike, count, SQL } from "drizzle-orm";
import { z } from "zod";

// 2. Create a robust Zod schema using the imported enum
const querySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  name: z.string().optional(),
  status: z.enum(institutionStatusEnum.enumValues).optional(), // Use the actual enum values
});

export async function GET(req: NextRequest) {
  try {
    // --- Authorization ---
    const { user } = await requireAuth();
    await RoleGuard.requireRole(user.id, "PLATFORM_ADMIN");

    // --- Input Validation ---
    const searchParams = req.nextUrl.searchParams;
    const query = Object.fromEntries(searchParams.entries());
    const validation = querySchema.safeParse(query);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Invalid query parameters.",
          details: validation.error.issues,
        },
        { status: 400 }
      );
    }

    const { page, limit, name, status } = validation.data;
    const offset = (page - 1) * limit;

    // --- Dynamic Query Construction ---
    const whereClauses: (SQL | undefined)[] = [
      name ? ilike(institutions.name, `%${name}%`) : undefined,
      status ? eq(institutions.status, status) : undefined, // Only add if status is provided
    ];
    const finalWhere = and(...whereClauses.filter((c): c is SQL => !!c));

    // --- Database Fetch (in parallel) ---
    const [data, total] = await Promise.all([
      db.query.institutions.findMany({
        where: finalWhere,
        limit,
        offset,
        orderBy: (institutions, { desc }) => [desc(institutions.createdAt)],
        with: {
          createdBy: {
            columns: {
              name: true,
              email: true,
            },
          },
        },
      }),
      db.select({ value: count() }).from(institutions).where(finalWhere),
    ]);

    const totalResults = total[0].value;
    const totalPages = Math.ceil(totalResults / limit);

    // --- Response ---
    return NextResponse.json({
      data,
      pagination: {
        currentPage: page,
        totalPages,
        totalResults,
        limit,
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes("Forbidden")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Failed to fetch institutions:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching institutions." },
      { status: 500 }
    );
  }
}
