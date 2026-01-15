// app/api/blog/[slug]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { blogPosts } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        { error: "Slug is required" },
        { status: 400 }
      );
    }

    // Fetch the blog post by slug
    const post = await db.query.blogPosts.findFirst({
      where: and(
        eq(blogPosts.slug, slug),
        eq(blogPosts.status, "PUBLISHED")
      ),
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
    });

    if (!post) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      );
    }

    // Increment views
    await db
      .update(blogPosts)
      .set({ views: (post.views || 0) + 1 })
      .where(eq(blogPosts.id, post.id));

    return NextResponse.json({ data: post });
  } catch (error) {
    console.error("Failed to fetch blog post:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching the blog post." },
      { status: 500 }
    );
  }
}
