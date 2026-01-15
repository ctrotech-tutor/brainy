// app/(marketing)/blog/[slug]/page.tsx
import { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogPostClient from "./BlogPostClient";

async function getBlogPost(slug: string) {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_APP_URL}/api/blog/${slug}`,
            { next: { revalidate: 60 } }
        );

        if (!res.ok) return null;
        const data = await res.json();
        return data.data;
    } catch (error) {
        return null;
    }
}

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
            publishedTime: post.publishedAt,
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

    return <BlogPostClient post={post} />;
}
