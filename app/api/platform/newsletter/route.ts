// app/api/platform/newsletter/route.ts
import { NextRequest } from "next/server";
import { db } from "@/db";
import { newsletterBroadcasts } from "@/db/schema";
import { requireAuth } from "@/lib/auth";
import { RoleGuard } from "@/lib/utils/roles";
import { eq, and, count, SQL, sql, desc, ilike } from "drizzle-orm";
import { z } from "zod";
import { ApiResponses } from "@/lib/api-response";
import { Cache } from "@/lib/cache";

const querySchema = z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(10),
    subject: z.string().optional(),
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

        const { page, limit, subject } = validation.data;
        const offset = (page - 1) * limit;

        const CACHE_KEY = Cache.key("platform", "newsletter", page, limit, subject || "all");
        const cached = await Cache.get<any>(CACHE_KEY);
        if (cached) return ApiResponses.success(cached);

        const whereClauses: (SQL | undefined)[] = [
            subject ? ilike(newsletterBroadcasts.subject, `%${subject}%`) : undefined,
        ];
        const finalWhere = and(...whereClauses.filter((c): c is SQL => !!c));

        const [data, total] = await Promise.all([
            db.query.newsletterBroadcasts.findMany({
                where: finalWhere,
                limit: limit,
                offset: offset,
                orderBy: [desc(newsletterBroadcasts.createdAt)],
                with: {
                    author: true
                }
            }),
            db.select({ value: count() }).from(newsletterBroadcasts).where(finalWhere),
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

        await Cache.set(CACHE_KEY, responseData, 3600); // 1 hour

        return ApiResponses.success(responseData);
    } catch (error) {
        return ApiResponses.handleError(error);
    }
}
