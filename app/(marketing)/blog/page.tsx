"use client";

import { Wrapper } from "@/components/ui/wrapper";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  ArrowRight,
  Sparkles,
  Shield,
  Zap,
  Building2,
  TrendingUp,
  Tag
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

const blogPosts = [
  {
    id: 1,
    title: "The Future of Academic Integrity in the Age of AI.",
    excerpt: "Exploring how institutions can leverage technology to protect the value of degrees while embracing AI innovation.",
    category: "Integrity",
    date: "Jan 12, 2026",
    readingTime: "6 min read",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=2070",
    icon: Shield,
    color: "hsl(var(--primary))",
  },
  {
    id: 2,
    title: "Scaling Educational Infrastructure: Lessons from Lagos.",
    excerpt: "How Brainy OS helped top universities streamline their examination workflows for 50,000+ students.",
    category: "Case Study",
    date: "Jan 8, 2026",
    readingTime: "8 min read",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=2070",
    icon: Building2,
    color: "hsl(var(--primary))",
  },
  {
    id: 3,
    title: "Introducing Brainy Insights: Data for Educators.",
    excerpt: "A deep dive into our new analytics dashboard designed to identify learning gaps across entire departments.",
    category: "Product Update",
    date: "Jan 5, 2026",
    readingTime: "4 min read",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2070",
    icon: Zap,
    color: "hsl(var(--primary))",
  },
  {
    id: 4,
    title: "Standardizing Online Assessments Globally.",
    excerpt: "Why uniformity in digital testing is the key to cross-border institutional recognition.",
    category: "Insights",
    date: "Dec 28, 2025",
    readingTime: "5 min read",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=2070",
    icon: TrendingUp,
    color: "hsl(var(--primary))",
  },
];

export default function BlogPage() {
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

        {/* Featured Post (First one) */}
        <div className="mb-24 px-4 sm:px-0">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="group relative rounded-[3rem] overflow-hidden bg-card/40 border border-white/5 backdrop-blur-xl"
          >
            <div className="grid lg:grid-cols-5 h-full min-h-[500px]">
              <div className="lg:col-span-3 relative overflow-hidden">
                <Image
                  src={blogPosts[0].image}
                  alt={blogPosts[0].title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-card/80 via-transparent to-transparent lg:hidden" />
              </div>
              <div className="lg:col-span-2 p-10 md:p-16 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-6">
                  <span className="px-4 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-black uppercase tracking-widest">
                    {blogPosts[0].category}
                  </span>
                  <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
                    <Calendar className="h-4 w-4" />
                    {blogPosts[0].date}
                  </div>
                </div>
                <h2 className="text-3xl md:text-5xl font-black tracking-tight text-foreground mb-6 leading-tight group-hover:text-primary transition-colors">
                  {blogPosts[0].title}
                </h2>
                <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
                  {blogPosts[0].excerpt}
                </p>
                <Link
                  href={`/blog/${blogPosts[0].id}`}
                  className="inline-flex items-center gap-3 text-foreground font-black group-hover:gap-5 transition-all"
                >
                  Read Full Story
                  <ArrowRight className="h-6 w-6 text-primary" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Blog Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 sm:px-0">
          {blogPosts.slice(1).map((post, idx) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="group flex flex-col rounded-[2.5rem] bg-card/30 border border-white/5 overflow-hidden backdrop-blur-md transition-all hover:bg-card/50 hover:border-primary/20 hover:-translate-y-2"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute top-6 left-6 h-12 w-12 rounded-2xl bg-white/10 backdrop-blur-xl flex items-center justify-center text-white border border-white/20">
                  <post.icon className="h-6 w-6" />
                </div>
              </div>
              <div className="p-10 flex flex-col flex-1">
                <div className="flex items-center justify-between mb-6">
                  <span className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary">
                    <Tag className="h-3 w-3" />
                    {post.category}
                  </span>
                  <div className="flex items-center gap-2 text-muted-foreground text-xs">
                    <Clock className="h-3 w-3" />
                    {post.readingTime}
                  </div>
                </div>
                <h3 className="text-2xl font-black tracking-tight text-foreground mb-4 group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-muted-foreground mb-8 line-clamp-3 leading-relaxed flex-1">
                  {post.excerpt}
                </p>
                <Link
                  href={`/blog/${post.id}`}
                  className="flex items-center gap-2 text-sm font-bold text-foreground group-hover:text-primary transition-colors"
                >
                  Read More
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Newsletter (Quick version for internal page) */}
        <div className="mt-32 rounded-[3rem] bg-primary p-12 md:p-24 relative overflow-hidden text-center md:text-left">
          <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none scale-150 rotate-12">
            <Sparkles className="h-64 w-64 text-white" />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="max-w-xl">
              <h2 className="text-4xl md:text-6xl font-black text-primary-foreground tracking-tighter mb-4">
                Don't miss a <span className="prose-italics opacity-80">beat.</span>
              </h2>
              <p className="text-xl text-primary-foreground/80">
                Weekly insights on academic tech and institutional growth, delivered straight to your inbox.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
              <input
                type="email"
                placeholder="you@institution.edu"
                className="h-16 rounded-2xl bg-white/10 border border-white/20 px-6 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 backdrop-blur-lg flex-1"
              />
              <button className="h-16 px-10 rounded-2xl bg-white text-primary font-black uppercase tracking-widest hover:bg-white/90 transition-colors shadow-2xl">
                Join
              </button>
            </div>
          </div>
        </div>
      </Wrapper>
    </>
  );
}
