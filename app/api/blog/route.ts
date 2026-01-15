// app/api/blog/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { blogPosts, blogCategories, blogTags, blogPostTags } from "@/db/schema";
import { eq, desc, and, ilike, count, SQL, or } from "drizzle-orm";
import { z } from "zod";

const querySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(12),
  search: z.string().optional(),
  category: z.string().optional(),
  tag: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const query = Object.fromEntries(searchParams.entries());
    const validation = querySchema.safeParse(query);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid query parameters", details: validation.error.issues },
        { status: 400 }
      );
    }

    const { page, limit, search, category, tag } = validation.data;
    const offset = (page - 1) * limit;

    // Build where clauses
    const whereClauses: (SQL | undefined)[] = [
      eq(blogPosts.status, "PUBLISHED"),
      search ? or(
        ilike(blogPosts.title, `%${search}%`),
        ilike(blogPosts.excerpt, `%${search}%`)
      ) : undefined,
    ];

    const finalWhere = and(...whereClauses.filter((c): c is SQL => !!c));

    // Fetch published blog posts with relations
    const [data, total] = await Promise.all([
      db.query.blogPosts.findMany({
        where: finalWhere,
        limit,
        offset,
        orderBy: (blogPosts, { desc }) => [desc(blogPosts.publishedAt)],
        with: {
          author: {
            columns: {
              id: true,
              name: true,
              image: true,
            },
          },
          category: {
            columns: {
              id: true,
              name: true,
              slug: true,
            },
          },
          tags: {
            with: {
              tag: {
                columns: {
                  id: true,
                  name: true,
                  slug: true,
                },
              },
            },
          },
        },
        columns: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          coverImage: true,
          publishedAt: true,
          readingTime: true,
          views: true,
        },
      }),
      db.select({ value: count() }).from(blogPosts).where(finalWhere),
    ]);

    const totalResults = total[0].value;
    const totalPages = Math.ceil(totalResults / limit);

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
    console.error("Failed to fetch blog posts:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching blog posts." },
      { status: 500 }
    );
  }
}
