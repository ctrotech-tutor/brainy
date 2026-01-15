// app/api/platform/blog/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { blogPosts, auditLogs } from "@/db/schema";
import { requireAuth } from "@/lib/auth";
import { RoleGuard } from "@/lib/utils/roles";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { ApiResponses } from "@/lib/api-response";

const updateBlogSchema = z.object({
  title: z.string().min(1).optional(),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/).optional(),
  excerpt: z.string().min(1).optional(),
  content: z.string().min(1).optional(),
  coverImage: z.string().url().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  categoryId: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
});

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user } = await requireAuth();
    await RoleGuard.requireRole(user.id, "PLATFORM_ADMIN");

    const { id } = await params;

    const post = await db.query.blogPosts.findFirst({
      where: eq(blogPosts.id, id),
      with: {
        author: { columns: { id: true, name: true, image: true } },
        category: { columns: { id: true, name: true, slug: true } },
        tags: {
          with: {
            tag: { columns: { id: true, name: true, slug: true } },
          },
        },
      },
    });

    if (!post) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: post });
  } catch (error) {
    return ApiResponses.handleError(error);
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user } = await requireAuth();
    await RoleGuard.requireRole(user.id, "PLATFORM_ADMIN");

    const { id } = await params;
    const body = await req.json();
    const validation = updateBlogSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid request body", details: validation.error.issues },
        { status: 400 }
      );
    }

    // Check if post exists
    const existingPost = await db.query.blogPosts.findFirst({
      where: eq(blogPosts.id, id),
    });

    if (!existingPost) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      );
    }

    const updateData = validation.data;

    // Recalculate reading time if content changed
    if (updateData.content) {
      const wordCount = updateData.content.split(/\s+/).length;
      const readingTime = Math.ceil(wordCount / 200);
      Object.assign(updateData, { readingTime });
    }

    // Set publishedAt if status changed to PUBLISHED
    if (updateData.status === "PUBLISHED" && existingPost.status !== "PUBLISHED") {
      Object.assign(updateData, { publishedAt: new Date() });
    }

    const updated = await db
      .update(blogPosts)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(blogPosts.id, id))
      .returning();

    // Create audit log
    await db.insert(auditLogs).values({
      actorId: user.id,
      action: `BLOG_POST_${updateData.status === "PUBLISHED" ? "PUBLISHED" : "UPDATED"}`,
      resourceId: id,
      resourceTable: "blog_posts",
      payload: {
        title: existingPost.title,
        changes: updateData,
      },
    });

    return NextResponse.json({ success: true, data: updated[0] });
  } catch (error: any) {
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "A post with this slug already exists" },
        { status: 409 }
      );
    }
    return ApiResponses.handleError(error);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user } = await requireAuth();
    await RoleGuard.requireRole(user.id, "PLATFORM_ADMIN");

    const { id } = await params;

    const post = await db.query.blogPosts.findFirst({
      where: eq(blogPosts.id, id),
    });

    if (!post) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      );
    }

    await db.delete(blogPosts).where(eq(blogPosts.id, id));

    // Create audit log
    await db.insert(auditLogs).values({
      actorId: user.id,
      action: "BLOG_POST_DELETED",
      resourceId: id,
      resourceTable: "blog_posts",
      payload: {
        title: post.title,
        slug: post.slug,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return ApiResponses.handleError(error);
  }
}
