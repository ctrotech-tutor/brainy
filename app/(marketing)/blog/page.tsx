"use client";

import { Wrapper } from "@/components/ui/wrapper";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  ArrowRight,
  Sparkles,
  Tag,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { format } from "date-fns";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
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
}

const fetchBlogPosts = async () => {
  const { data } = await axios.get("/api/blog?limit=12");
  return data;
};

export default function BlogPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["blog-posts"],
    queryFn: fetchBlogPosts,
  });

  const posts: BlogPost[] = data?.data || [];
  const featuredPost = posts[0];
  const gridPosts = posts.slice(1);

  return (
    <>
      <Wrapper className="py-24 sm:py-32">
        {/* Blog Header */}
        <div className="max-w-4xl mx-auto text-center mb-24 md:mb-32 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-6">
              <Sparkles className="h-3 w-3" />
              Insights & Updates
            </div>
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tighter text-foreground mb-8 leading-[0.9]">
              The <span className="text-primary prose-italics">Brainy</span> Journal.
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Stories of innovation, academic excellence, and the technology
              powering the future of institutional assessment.
            </p>
          </motion.div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-32">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        ) : isError || posts.length === 0 ? (
          <div className="text-center py-32">
            <p className="text-muted-foreground text-lg">No blog posts available yet.</p>
          </div>
        ) : (
          <>
            {/* Featured Post */}
            {featuredPost && (
              <div className="mb-24 px-4 sm:px-0">
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="group relative rounded-[3rem] overflow-hidden bg-card border border-border backdrop-blur-xl shadow-xl"
                >
                  <div className="grid lg:grid-cols-5 h-full min-h-[500px]">
                    <div className="lg:col-span-3 relative overflow-hidden">
                      {featuredPost.coverImage ? (
                        <Image
                          src={featuredPost.coverImage}
                          alt={featuredPost.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-r from-card/80 via-transparent to-transparent lg:hidden" />
                    </div>
                    <div className="lg:col-span-2 p-10 md:p-16 flex flex-col justify-center">
                      <div className="flex items-center gap-3 mb-6">
                        {featuredPost.category && (
                          <span className="px-4 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-black uppercase tracking-widest">
                            {featuredPost.category.name}
                          </span>
                        )}
                        <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
                          <Calendar className="h-4 w-4" />
                          {format(new Date(featuredPost.publishedAt), "MMM dd, yyyy")}
                        </div>
                      </div>
                      <h2 className="text-3xl md:text-5xl font-black tracking-tight text-foreground mb-6 leading-tight group-hover:text-primary transition-colors">
                        {featuredPost.title}
                      </h2>
                      <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
                        {featuredPost.excerpt}
                      </p>
                      <Link
                        href={`/blog/${featuredPost.slug}`}
                        className="inline-flex items-center gap-3 text-foreground font-black group-hover:gap-5 transition-all"
                      >
                        Read Full Story
                        <ArrowRight className="h-6 w-6 text-primary" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}

            {/* Blog Grid */}
            {gridPosts.length > 0 && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 sm:px-0">
                {gridPosts.map((post, idx) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="group flex flex-col rounded-[3.5rem] bg-card border border-border overflow-hidden backdrop-blur-md transition-all hover:bg-accent/40 hover:border-primary/20 hover:-translate-y-2 shadow-sm"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden">
                      {post.coverImage ? (
                        <Image
                          src={post.coverImage}
                          alt={post.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/10 to-accent/10" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-card/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="p-10 flex flex-col flex-1">
                      <div className="flex items-center justify-between mb-6">
                        {post.category && (
                          <span className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary">
                            <Tag className="h-3 w-3" />
                            {post.category.name}
                          </span>
                        )}
                        {post.readingTime && (
                          <div className="flex items-center gap-2 text-muted-foreground text-xs">
                            <Clock className="h-3 w-3" />
                            {post.readingTime} min read
                          </div>
                        )}
                      </div>
                      <h3 className="text-2xl font-black tracking-tight text-foreground mb-4 group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-muted-foreground mb-8 line-clamp-3 leading-relaxed flex-1">
                        {post.excerpt}
                      </p>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="flex items-center gap-2 text-sm font-bold text-foreground group-hover:text-primary transition-colors"
                      >
                        Read More
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}
      </Wrapper>
    </>
  );
}
