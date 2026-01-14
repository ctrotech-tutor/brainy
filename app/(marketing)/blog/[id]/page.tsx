"use client";

import { Wrapper } from "@/components/ui/wrapper";
import { motion } from "framer-motion";
import {
    Calendar,
    Clock,
    ArrowLeft,
    Share2,
    Twitter,
    Linkedin,
    Link as LinkIcon,
    ChevronRight,
    BookOpen
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";

// Mock data for the specific post (in a real app, this would be fetched from a DB via API)
const blogPosts = [
    {
        id: "1",
        title: "The Future of Academic Integrity in the Age of AI.",
        excerpt: "Exploring how institutions can leverage technology to protect the value of degrees while embracing AI innovation.",
        content: `
      <p>As Artificial Intelligence continues to reshape the landscape of modern education, the conversation around academic integrity has reached a critical turning point. The traditional methods of oversight are becoming obsolete in the face of Large Language Models (LLMs) and automated content generation.</p>
      
      <h2>The Challenge of the Unknown</h2>
      <p>The primary concern for institutions today is not just the presence of AI, but the speed at which it evolves. Students now have access to tools that can generate complex essays, solve advanced mathematical problems, and even write code in seconds. This creates a verification gap that threatens the perceived value of academic degrees.</p>
      
      <blockquote>
        "The value of a degree is not found in the paper it's printed on, but in the verified struggle and learning that occurred to earn it."
      </blockquote>

      <h2>Building the Infrastructure for Trust</h2>
      <p>At Brainy OS, we believe the solution is not to ban AI, but to build an infrastructure where every interaction is verifiable. Our 'Security by Design' approach ensures that assessments are conducted in a way that prioritizes authentic performance over memorization.</p>
      
      <h3>Key Strategies for 2026:</h3>
      <ul>
        <li><strong>Dynamic Assessments:</strong> Moving away from predictable testing formats to randomized, role-based evaluations.</li>
        <li><strong>Behavioral Insights:</strong> Using backend analytics to identify patterns that go beyond simple plagiarism detection.</li>
        <li><strong>Institutional Verification:</strong> Strengthening the link between student identity and submission data.</li>
      </ul>

      <p>The future of education thrives when technology empowers educators to provide deeper insights and prevents the erosion of institutional standards. Brainy is proud to be at the forefront of this movement.</p>
    `,
        category: "Integrity",
        date: "Jan 12, 2026",
        readingTime: "6 min read",
        author: {
            name: "Dr. Sarah Chen",
            role: "Head of AI Research, Ctrotech",
            image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150"
        },
        image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=2070",
    }
];

export default function BlogPostPage() {
    const params = useParams();
    const id = params.id as string;

    // Find the post or use the first one as a fallback for the demo
    const post = blogPosts.find(p => p.id === id) || blogPosts[0];

    return (
        <>
            <Wrapper className="py-24 md:py-32">
                <div className="max-w-4xl mx-auto">
                    {/* Breadcrumbs & Navigation */}
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center justify-between mb-12"
                    >
                        <Link
                            href="/blog"
                            className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors group"
                        >
                            <div className="h-8 w-8 rounded-full bg-secondary/50 flex items-center justify-center group-hover:bg-primary/10 transition-all">
                                <ArrowLeft className="h-4 w-4" />
                            </div>
                            Back to Journal
                        </Link>

                        <div className="flex items-center gap-4">
                            <button className="h-10 w-10 rounded-xl bg-card border border-white/5 flex items-center justify-center text-muted-foreground hover:text-primary transition-all">
                                <Share2 className="h-4 w-4" />
                            </button>
                            <button className="h-10 w-28 rounded-xl bg-primary text-primary-foreground text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 transition-all">
                                Share Post
                            </button>
                        </div>
                    </motion.div>

                    {/* Article Header */}
                    <div className="mb-16">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="flex items-center gap-4 mb-8">
                                <span className="px-4 py-1.5 rounded-full bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/10">
                                    {post.category}
                                </span>
                                <div className="h-px w-8 bg-white/10" />
                                <div className="flex items-center gap-2 text-muted-foreground text-xs font-bold uppercase tracking-widest">
                                    <Calendar className="h-3.5 w-3.5" />
                                    {post.date}
                                </div>
                                <div className="h-1 w-1 rounded-full bg-white/20" />
                                <div className="flex items-center gap-2 text-muted-foreground text-xs font-bold uppercase tracking-widest">
                                    <Clock className="h-3.5 w-3.5" />
                                    {post.readingTime}
                                </div>
                            </div>

                            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-foreground mb-12 leading-[1.1]">
                                {post.title}
                            </h1>

                            <div className="flex items-center gap-4 p-6 rounded-[2rem] bg-card/40 border border-white/5 backdrop-blur-md w-fit">
                                <div className="relative h-12 w-12 rounded-full overflow-hidden border-2 border-primary/20">
                                    <Image src={post.author.image} alt={post.author.name} fill className="object-cover" />
                                </div>
                                <div>
                                    <div className="font-bold text-foreground">{post.author.name}</div>
                                    <div className="text-xs text-muted-foreground font-medium">{post.author.role}</div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Feature Image */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="relative aspect-[21/9] rounded-[3.5rem] overflow-hidden mb-20 shadow-2xl"
                    >
                        <Image src={post.image} alt={post.title} fill className="object-cover" priority />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
                    </motion.div>

                    {/* Article Content */}
                    <div className="grid lg:grid-cols-12 gap-16">
                        {/* Left Sidebar: Socials */}
                        <aside className="hidden lg:block lg:col-span-1">
                            <div className="sticky top-32 flex flex-col gap-6">
                                {[Twitter, Linkedin, LinkIcon].map((Icon, i) => (
                                    <button
                                        key={i}
                                        className="h-12 w-12 rounded-2xl bg-card border border-white/5 flex items-center justify-center text-muted-foreground hover:text-primary transition-all hover:-translate-y-1"
                                    >
                                        <Icon className="h-5 w-5" />
                                    </button>
                                ))}
                            </div>
                        </aside>

                        {/* Main Content Area */}
                        <main className="lg:col-span-8">
                            <motion.article
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 1, delay: 0.3 }}
                                className="prose prose-xl prose-invert max-w-none 
                  prose-headings:font-black prose-headings:tracking-tighter prose-headings:text-foreground
                  prose-p:text-muted-foreground/90 prose-p:leading-relaxed prose-p:mb-8
                  prose-li:text-muted-foreground/90 prose-li:mb-2
                  prose-strong:text-primary prose-strong:font-bold
                  prose-blockquote:border-primary prose-blockquote:bg-primary/5 prose-blockquote:p-8 prose-blockquote:rounded-3xl prose-blockquote:font-black prose-blockquote:tracking-tight prose-blockquote:text-2xl prose-blockquote:text-foreground
                  prose-img:rounded-[2.5rem]"
                                dangerouslySetInnerHTML={{ __html: post.content }}
                            />

                            {/* Tags/Categories bottom */}
                            <div className="mt-20 pt-12 border-t border-white/5 flex flex-wrap gap-3">
                                {["Education", "AI", "Future", "Assessment"].map(tag => (
                                    <span key={tag} className="px-4 py-2 rounded-xl bg-secondary/50 text-muted-foreground text-sm font-bold border border-white/5">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </main>

                        {/* Right Sidebar: Related News */}
                        <aside className="lg:col-span-3">
                            <div className="sticky top-32 space-y-10">
                                <div className="rounded-[2.5rem] bg-card/30 border border-white/5 p-8 backdrop-blur-xl">
                                    <h3 className="text-lg font-black text-foreground mb-6 flex items-center gap-2">
                                        <BookOpen className="h-5 w-5 text-primary" />
                                        Read Next
                                    </h3>
                                    <div className="space-y-8">
                                        {[1, 2].map(i => (
                                            <Link key={i} href="#" className="group block">
                                                <div className="text-[10px] font-black uppercase tracking-widest text-primary mb-2">Case Study</div>
                                                <h4 className="font-bold text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-2">
                                                    {i === 1 ? "Scaling Educational Infrastructure in Lagos" : "How Data Analytics Empowers Tutors"}
                                                </h4>
                                                <div className="mt-3 flex items-center gap-2 text-muted-foreground text-[10px] font-bold">
                                                    Jan 2026 <ChevronRight className="h-3 w-3" />
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>

                                <div className="rounded-[2.5rem] bg-primary p-8 text-center">
                                    <h3 className="text-xl font-black text-primary-foreground tracking-tighter mb-4">
                                        Ready to start?
                                    </h3>
                                    <p className="text-sm text-primary-foreground/70 mb-6">
                                        Join 1,000+ educators using Brainy today.
                                    </p>
                                    <Button asChild className="w-full h-12 rounded-xl bg-white text-primary font-bold shadow-xl shadow-black/10">
                                        <Link href="/get-started">Get Started</Link>
                                    </Button>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </Wrapper>
        </>
    );
}
