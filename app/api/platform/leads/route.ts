// app/api/platform/leads/route.ts
import { NextRequest } from "next/server";
import { db } from "@/db";
import { marketingLeads } from "@/db/schema";
import { requireAuth } from "@/lib/auth";
import { RoleGuard } from "@/lib/utils/roles";
import { eq, and, count, SQL, sql, desc, ilike, or } from "drizzle-orm";
import { z } from "zod";
import { ApiResponses } from "@/lib/api-response";
import { Cache } from "@/lib/cache";

const querySchema = z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(10),
    name: z.string().optional(), // Using 'name' but we'll search name/email/subject
    status: z.string().optional(),
});

export async function GET(req: NextRequest) {
    try {
        const { user } = await requireAuth();
        await RoleGuard.requireRole(user.id, "PLATFORM_ADMIN");

        const searchParams = req.nextUrl.searchParams;
        const rawQuery = Object.fromEntries(searchParams.entries());
        const validation = querySchema.safeParse(rawQuery);

        if (!validation.success) {
            return ApiResponses.validationError(validation.error.issues);
        }

        const { page, limit, name, status } = validation.data;
        const offset = (page - 1) * limit;

        const CACHE_KEY = Cache.key("platform", "leads", page, limit, name || "all", status || "all");
        const cached = await Cache.get<any>(CACHE_KEY);
        if (cached) return ApiResponses.success(cached);

        const whereClauses: (SQL | undefined)[] = [];

        if (name) {
            whereClauses.push(
                or(
                    ilike(marketingLeads.name, `%${name}%`),
                    ilike(marketingLeads.email, `%${name}%`),
                    ilike(marketingLeads.subject, `%${name}%`)
                )
            );
        }

        if (status && status !== "All") {
            whereClauses.push(eq(marketingLeads.status, status));
        }

        const finalWhere = and(...whereClauses.filter((c): c is SQL => !!c));

        const [data, total] = await Promise.all([
            db.query.marketingLeads.findMany({
                where: finalWhere,
                limit: limit,
                offset: offset,
                orderBy: [desc(marketingLeads.createdAt)],
            }),
            db.select({ value: count() }).from(marketingLeads).where(finalWhere),
        ]);

        const totalResults = total[0].value;
        const totalPages = Math.ceil(totalResults / limit);

        const responseData = {
            data,
            pagination: {
                currentPage: page,
                totalPages,
                totalResults,
                limit,
            },
        };

        await Cache.set(CACHE_KEY, responseData, 300); // 5 minutes

        return ApiResponses.success(responseData);
    } catch (error) {
        return ApiResponses.handleError(error);
    }
}
