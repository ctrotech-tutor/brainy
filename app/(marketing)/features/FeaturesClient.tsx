// app/(marketing)/features/FeaturesClient.tsx
"use client";

import { Wrapper } from "@/components/ui/wrapper";
import { motion } from "framer-motion";
import {
    ShieldCheck,
    Cpu,
    Zap,
    Users,
    Building2,
    BarChart3,
    Lock,
    Globe,
    Sparkles,
    CheckCircle2,
    Clock,
    LayoutDashboard,
    UserCircle,
    Pencil
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const featureGroups = [
    {
        title: "For Students",
        subtitle: "Verify your expertise.",
        icon: Users,
        features: [
            { title: "Universal Profile", description: "One identity that follows you across institutions.", icon: UserCircle },
            { title: "Skill Rank", description: "Visualize your academic standing with real-time analytics.", icon: BarChart3 },
            { title: "Digital Badges", description: "Shareable credentials for LinkedIn and your resume.", icon: Sparkles }
        ],
        color: "primary"
    },
    {
        title: "For Tutors",
        subtitle: "Educate with intelligence.",
        icon: Pencil,
        features: [
            { title: "AI Quiz Engine", description: "Generate complex assessments from course materials in seconds.", icon: Cpu },
            { title: "Integrity Guard", description: "Proprietary algorithms that flag suspicious student patterns.", icon: ShieldCheck },
            { title: "Instant Grading", description: "Automated feedback for objective and short-answer questions.", icon: Zap }
        ],
        color: "emerald"
    },
    {
        title: "For Institutions",
        subtitle: "Scale with confidence.",
        icon: Building2,
        features: [
            { title: "Administrative Dashboard", description: "High-level overview of department performance and audit logs.", icon: LayoutDashboard },
            { title: "Role-Based Access", description: "Granular control over who can create, edit, or view content.", icon: Lock },
            { title: "LRS Integration", description: "Standard-compliant data exports for external systems.", icon: Globe }
        ],
        color: "indigo"
    }
];

export function FeaturesClient() {
    return (
        <div className="relative isolate">
            <Wrapper className="py-24 sm:py-32">
                {/* Hero Section */}
                <div className="text-center max-w-4xl mx-auto mb-32">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-6">
                            <ShieldCheck className="h-3 w-3" />
                            Advanced Capability
                        </div>
                        <h1 className="text-6xl sm:text-8xl font-black tracking-tighter text-foreground mb-10 leading-[0.9]">
                            The Operating System for <span className="text-primary italic">Modern Education.</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
                            Brainy isn't just a quiz tool—it's the infrastructure that powers academic integrity,
                            institutional scaling, and AI-driven insights across the globe.
                        </p>
                    </motion.div>
                </div>

                {/* Deep Dive Sections */}
                <div className="space-y-32">
                    {featureGroups.map((group, groupIdx) => (
                        <div key={group.title} className="relative">
                            <div className="flex flex-col lg:flex-row gap-16 items-start">
                                <motion.div
                                    initial={{ opacity: 0, x: groupIdx % 2 === 0 ? -30 : 30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    className="lg:w-1/3 sticky top-32"
                                >
                                    <div className="h-16 w-16 rounded-[1.5rem] bg-primary/10 flex items-center justify-center text-primary mb-8">
                                        <group.icon className="h-8 w-8" />
                                    </div>
                                    <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground mb-4">
                                        {group.title}
                                    </h2>
                                    <p className="text-xl text-muted-foreground mb-12">
                                        {group.subtitle}
                                    </p>

                                    <Button asChild size="lg" className="h-14 rounded-2xl px-8 font-bold">
                                        <Link href={`/auth/signup?intent=${group.title.toLowerCase().replace("for ", "")}`}>
                                            Start for {group.title.split(" ")[1]}
                                        </Link>
                                    </Button>
                                </motion.div>

                                <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {group.features.map((feature, featureIdx) => (
                                        <motion.div
                                            key={feature.title}
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: featureIdx * 0.1 }}
                                            className="p-8 rounded-[2.5rem] bg-card border border-border backdrop-blur-md hover:bg-accent/40 transition-all group shadow-sm"
                                        >
                                            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                                                <feature.icon className="h-6 w-6" />
                                            </div>
                                            <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
                                            <p className="text-muted-foreground text-sm leading-relaxed">
                                                {feature.description}
                                            </p>
                                        </motion.div>
                                    ))}

                                    {/* Large Visual Feature Card */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        className="md:col-span-2 p-10 rounded-[3rem] bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 relative overflow-hidden group"
                                    >
                                        <div className="relative z-10 max-w-md">
                                            <div className="flex items-center gap-2 text-primary font-black uppercase tracking-tighter text-xs mb-4">
                                                <Zap className="h-4 w-4" />
                                                Platform Exclusive
                                            </div>
                                            <h4 className="text-3xl font-black text-foreground mb-4 tracking-tighter">
                                                Uncompromised Integrity Engine
                                            </h4>
                                            <p className="text-muted-foreground text-sm leading-relaxed mb-8">
                                                Every interaction on Brainy is logged, encrypted, and verified against
                                                our proprietary academic honesty model.
                                            </p>
                                            <ul className="space-y-3">
                                                {["IP-Based Lockouts", "Biometric Validation", "Plagiarism Analysis"].map(item => (
                                                    <li key={item} className="flex items-center gap-2 text-foreground/80 font-bold text-sm">
                                                        <CheckCircle2 className="h-4 w-4 text-primary" />
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-10 pointer-events-none transition-transform duration-700 group-hover:scale-125">
                                            <ShieldCheck className="h-full w-full" />
                                        </div>
                                    </motion.div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Global Security & Infrastructure */}
                <div className="mt-48">
                    <div className="text-center max-w-2xl mx-auto mb-20">
                        <h2 className="text-4xl font-black tracking-tighter text-foreground mb-6">
                            Built for Global <span className="text-primary italic">Scale.</span>
                        </h2>
                        <p className="text-muted-foreground">
                            Underneath the sleek UI lies an infrastructure built to handle
                            millions of requests with sub-millisecond latency.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12">
                        {[
                            { icon: Globe, title: "Edge Distributed", text: "Low-latency access from anywhere in the world." },
                            { icon: Lock, title: "LRS Compliant", text: "Standardized learning data storage and retrieval." },
                            { icon: Clock, title: "Real-time Sync", text: "Immediate result propagation across the entire organization." }
                        ].map((item, i) => (
                            <div key={i} className="text-center group">
                                <div className="h-20 w-20 rounded-[2rem] bg-accent border border-border mx-auto flex items-center justify-center text-primary mb-8 transition-all group-hover:-translate-y-2 group-hover:bg-primary/10 group-hover:border-primary/20">
                                    <item.icon className="h-10 w-10" />
                                </div>
                                <h3 className="text-xl font-bold text-foreground mb-3">{item.title}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">{item.text}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom CTA */}
                <div className="mt-48 p-12 md:p-24 rounded-[4rem] bg-card/30 border border-white/5 text-center relative overflow-hidden backdrop-blur-2xl">
                    <div className="absolute inset-0 bg-primary/5 blur-3xl opacity-20 -z-10" />
                    <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-foreground mb-10 leading-none">
                        The next chapter of <br />
                        <span className="text-primary prose-italics">academic excellence.</span>
                    </h2>
                    <div className="flex flex-wrap justify-center gap-6">
                        <Button asChild size="lg" className="h-16 px-12 rounded-2xl text-lg font-bold shadow-2xl shadow-primary/20">
                            <Link href="/auth/signup">Launch Platform</Link>
                        </Button>
                        <Button asChild variant="outline" size="lg" className="h-16 px-12 rounded-2xl text-lg font-bold border-border hover:bg-accent">
                            <Link href="/contact">Request Demo</Link>
                        </Button>
                    </div>
                </div>
            </Wrapper>
        </div>
    );
}
