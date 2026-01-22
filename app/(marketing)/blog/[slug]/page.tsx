// app/(marketing)/blog/[slug]/page.tsx
import { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogPostClient from "./BlogPostClient";
import { db } from "@/db";
import { blogPosts } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { cache } from "react";

const getBlogPost = cache(async (slug: string) => {
    try {
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
        return post || null;
    } catch (error) {
        console.error("Error fetching blog post:", error);
        return null;
    }
});

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const post = await getBlogPost(slug);

    if (!post) {
        return {
            title: "Post Not Found",
        };
    }

    return {
        title: post.metaTitle || post.title,
        description: post.metaDescription || post.excerpt,
        openGraph: {
            title: post.metaTitle || post.title,
            description: post.metaDescription || post.excerpt,
            type: "article",
            publishedTime: post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined,
            authors: [post.author.name || "Brainy OS"],
            images: post.coverImage ? [post.coverImage] : [],
        },
        twitter: {
            card: "summary_large_image",
            title: post.metaTitle || post.title,
            description: post.metaDescription || post.excerpt,
            images: post.coverImage ? [post.coverImage] : [],
        },
    };
}

export default async function BlogPostPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const post = await getBlogPost(slug);

    if (!post) {
        notFound();
    }

    // Increment views
    // Use try-catch to prevent page load failure if stats fail
    try {
        await db
            .update(blogPosts)
            .set({ views: (post.views || 0) + 1 })
            .where(eq(blogPosts.id, post.id));
    } catch (e) {
        console.error("Failed to increment views", e);
    }

    const serializedPost = {
        ...post,
        publishedAt: post.publishedAt?.toISOString() ?? post.createdAt.toISOString(),
        createdAt: post.createdAt.toISOString(),
        updatedAt: post.updatedAt.toISOString(),
    };

    return <BlogPostClient post={serializedPost} />;
}
