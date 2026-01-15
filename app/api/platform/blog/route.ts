// app/api/platform/blog/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { blogPosts, blogCategories, auditLogs } from "@/db/schema";
import { requireAuth } from "@/lib/auth";
import { RoleGuard } from "@/lib/utils/roles";
import { eq, desc, and, ilike, count, SQL } from "drizzle-orm";
import { z } from "zod";
import { createId } from "@paralleldrive/cuid2";
import { ApiResponses } from "@/lib/api-response";

// Query schema for listing
const querySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
});

// Create blog post schema
const createBlogSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must be lowercase with hyphens"),
  excerpt: z.string().min(1, "Excerpt is required"),
  content: z.string().min(1, "Content is required"),
  coverImage: z.string().url().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  categoryId: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
  tags: z.array(z.string()).optional(),
});

export async function GET(req: NextRequest) {
  try {
    const { user } = await requireAuth();
    await RoleGuard.requireRole(user.id, "PLATFORM_ADMIN");

    const searchParams = req.nextUrl.searchParams;
    const query = Object.fromEntries(searchParams.entries());
    const validation = querySchema.safeParse(query);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid query parameters", details: validation.error.issues },
        { status: 400 }
      );
    }

    const { page, limit, search, status } = validation.data;
    const offset = (page - 1) * limit;

    const whereClauses: (SQL | undefined)[] = [
      search ? ilike(blogPosts.title, `%${search}%`) : undefined,
      status ? eq(blogPosts.status, status) : undefined,
    ];

    const finalWhere = and(...whereClauses.filter((c): c is SQL => !!c));

    const [data, total] = await Promise.all([
      db.query.blogPosts.findMany({
        where: finalWhere,
        limit,
        offset,
        orderBy: (blogPosts, { desc }) => [desc(blogPosts.createdAt)],
        with: {
          author: {
            columns: { id: true, name: true, image: true },
          },
          category: {
            columns: { id: true, name: true, slug: true },
          },
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
    return ApiResponses.handleError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const { user } = await requireAuth();
    await RoleGuard.requireRole(user.id, "PLATFORM_ADMIN");

    const body = await req.json();
    const validation = createBlogSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid request body", details: validation.error.issues },
        { status: 400 }
      );
    }

    const { tags, ...postData } = validation.data;
    const postId = createId();

    // Calculate reading time (rough estimate: 200 words per minute)
    const wordCount = postData.content.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200);

    const newPost = await db.insert(blogPosts).values({
      id: postId,
      ...postData,
      authorId: user.id,
      readingTime,
      publishedAt: postData.status === "PUBLISHED" ? new Date() : null,
    }).returning();

    // Create audit log
    await db.insert(auditLogs).values({
      actorId: user.id,
      action: "BLOG_POST_CREATED",
      resourceId: postId,
      resourceTable: "blog_posts",
      payload: {
        title: postData.title,
        slug: postData.slug,
        status: postData.status,
      },
    });

    return NextResponse.json(
      { success: true, data: newPost[0] },
      { status: 201 }
    );
  } catch (error: any) {
    if (error.code === "23505") { // Unique constraint violation
      return NextResponse.json(
        { error: "A post with this slug already exists" },
        { status: 409 }
      );
    }
    return ApiResponses.handleError(error);
  }
}
