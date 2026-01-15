// app/(platform)/platform/blog/[id]/edit/page.tsx
import { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogEditorClient from "../../_components/BlogEditorClient";
import { db } from "@/db";
import { blogPosts } from "@/db/schema";
import { eq } from "drizzle-orm";

export const metadata: Metadata = {
    title: "Edit Blog Post",
    description: "Edit an existing blog post",
};

async function getBlogPost(id: string) {
    try {
        const post = await db.query.blogPosts.findFirst({
            where: eq(blogPosts.id, id),
            with: {
                category: true,
                tags: {
                    with: {
                        tag: true,
                    },
                },
            },
        });
        return post;
    } catch (error) {
        return null;
    }
}

export default async function EditBlogPostPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const post = await getBlogPost(id);

    if (!post) {
        notFound();
    }

    return <BlogEditorClient mode="edit" post={post} />;
}
