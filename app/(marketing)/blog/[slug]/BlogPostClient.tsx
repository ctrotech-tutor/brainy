// app/(marketing)/blog/[slug]/BlogPostClient.tsx
"use client";

import { Wrapper } from "@/components/ui/wrapper";
import { motion } from "framer-motion";
import {
    Calendar,
    Clock,
    ArrowLeft,
    User,
    Tag,
    Eye,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface BlogPostClientProps {
    post: {
        id: string;
        title: string;
        slug: string;
        excerpt: string;
        content: string;
        coverImage: string | null;
        publishedAt: string;
        readingTime: number | null;
        views: number;
        author: {
            id: string;
            name: string | null;
            image: string | null;
        };
        category: {
            id: string;
            name: string;
            slug: string;
        } | null;
        tags: Array<{
            tag: {
                id: string;
                name: string;
                slug: string;
            };
        }>;
    };
}

export default function BlogPostClient({ post }: BlogPostClientProps) {
    return (
        <Wrapper className="py-24 sm:py-32">
            <div className="max-w-4xl mx-auto px-4">
                {/* Back Button */}
                <Link
                    href="/blog"
                    className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-12 text-sm font-bold"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Blog
                </Link>

                {/* Post Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-12"
                >
                    {post.category && (
                        <span className="inline-block px-4 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-black uppercase tracking-widest mb-6">
                            {post.category.name}
                        </span>
                    )}

                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter text-foreground mb-8 leading-tight">
                        {post.title}
                    </h1>

                    <p className="text-xl text-muted-foreground leading-relaxed mb-8">
                        {post.excerpt}
                    </p>

                    {/* Meta Information */}
                    <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                            {post.author.image ? (
                                <Image
                                    src={post.author.image}
                                    alt={post.author.name || "Author"}
                                    width={32}
                                    height={32}
                                    className="rounded-full"
                                />
                            ) : (
                                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                    <User className="h-4 w-4 text-primary" />
                                </div>
                            )}
                            <span className="font-medium text-foreground">
                                {post.author.name || "Anonymous"}
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>{format(new Date(post.publishedAt), "MMMM dd, yyyy")}</span>
                        </div>

                        {post.readingTime && (
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                <span>{post.readingTime} min read</span>
                            </div>
                        )}

                        <div className="flex items-center gap-2">
                            <Eye className="h-4 w-4" />
                            <span>{post.views.toLocaleString()} views</span>
                        </div>
                    </div>
                </motion.div>

                {/* Cover Image */}
                {post.coverImage && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="relative aspect-[16/9] rounded-[3rem] overflow-hidden mb-16 border border-border shadow-2xl"
                    >
                        <Image
                            src={post.coverImage}
                            alt={post.title}
                            fill
                            className="object-cover"
                            priority
                        />
                    </motion.div>
                )}

                {/* Post Content */}
                <motion.article
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="prose prose-lg dark:prose-invert max-w-none mb-16"
                >
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {post.content}
                    </ReactMarkdown>
                </motion.article>

                {/* Tags */}
                {post.tags.length > 0 && (
                    <div className="flex flex-wrap items-center gap-3 mb-16">
                        <Tag className="h-4 w-4 text-muted-foreground" />
                        {post.tags.map(({ tag }) => (
                            <span
                                key={tag.id}
                                className="px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-bold"
                            >
                                {tag.name}
                            </span>
                        ))}
                    </div>
                )}

                {/* Author Card */}
                <div className="rounded-[2rem] border border-border bg-card p-8 flex items-center gap-6">
                    {post.author.image ? (
                        <Image
                            src={post.author.image}
                            alt={post.author.name || "Author"}
                            width={80}
                            height={80}
                            className="rounded-full"
                        />
                    ) : (
                        <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="h-10 w-10 text-primary" />
                        </div>
                    )}
                    <div>
                        <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-2">
                            Written By
                        </p>
                        <h3 className="text-xl font-black text-foreground">
                            {post.author.name || "Anonymous"}
                        </h3>
                    </div>
                </div>
            </div>
        </Wrapper>
    );
}
