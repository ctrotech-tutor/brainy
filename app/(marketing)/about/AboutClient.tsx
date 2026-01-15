// app/(marketing)/about/AboutClient.tsx
"use client";

import { Wrapper } from "@/components/ui/wrapper";
import { motion } from "framer-motion";
import {
    ShieldCheck,
    Target,
    Globe,
    Sparkles
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const team = [
    {
        name: "Aunty Tutu",
        role: "Founding Architect",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800",
        bio: "Pioneering the intersection of academic integrity and distributed systems."
    },
    {
        name: "David Ctrotech",
        role: "Head of AI",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800",
        bio: "Developer of the core Brainy integrity algorithms and predictive modeling."
    },
    {
        name: "Sarah Chen",
        role: "Institutional Strategy",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=800",
        bio: "Specialist in global educational compliance and standards implementation."
    }
];

export function AboutClient() {
    return (
        <div className="relative overflow-hidden">
            <Wrapper className="py-24 sm:py-32">
                {/* Hero Section */}
                <div className="text-center max-w-4xl mx-auto mb-24 md:mb-40">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-card border border-border text-sm font-bold tracking-widest uppercase text-muted-foreground mb-8">
                            <Sparkles className="h-4 w-4 text-primary" />
                            Our Mission
                        </div>
                        <h1 className="text-6xl sm:text-8xl lg:text-9xl font-black tracking-tighter text-foreground mb-10 leading-[0.85]">
                            The Standard for <br />
                            <span className="text-primary italic">Academic Value.</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                            Brainy was born from a simple realization: the digital transition of education
                            failed to protect the most important asset—the value of a degree.
                        </p>
                    </motion.div>
                </div>

                {/* Vision & Story Section */}
                <div className="grid lg:grid-cols-2 gap-20 items-center mb-40">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="relative aspect-[4/5] rounded-[3rem] overflow-hidden group"
                    >
                        <div className="absolute inset-0 bg-primary/20 mix-blend-overlay z-10" />
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent z-20" />
                        <Image
                            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=2070"
                            alt="Team collaboration"
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute bottom-12 left-12 z-30">
                            <div className="text-5xl font-black text-white tracking-tighter">EST. 2024</div>
                            <div className="text-white/60 font-bold uppercase tracking-widest text-sm">Founded by Ctrotech</div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-10"
                    >
                        <div className="inline-flex items-center gap-2 text-primary font-black uppercase tracking-widest text-sm">
                            <Target className="h-5 w-5" />
                            The Vision
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-foreground leading-none">
                            Infrastructure that <br />
                            Empowers.
                        </h2>
                        <div className="prose prose-xl prose-invert text-muted-foreground">
                            <p>
                                Brainy isn't just quiz software—it's a comprehensive OS for institutions.
                                Our ecosystem bridges the gap between students, tutors, and administrators
                                using verifiable security and AI-driven insights.
                            </p>
                            <p>
                                Every line of code is written with the intent to eliminate academic
                                malpractice and streamline educational bureaucracy across the globe.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-8 pt-8 border-t border-border">
                            <div>
                                <div className="text-4xl font-black text-foreground mb-1 tracking-tight">100%</div>
                                <div className="text-sm font-bold uppercase tracking-widest opacity-40">Verifiable</div>
                            </div>
                            <div>
                                <div className="text-4xl font-black text-foreground mb-1 tracking-tight">24/7</div>
                                <div className="text-sm font-bold uppercase tracking-widest opacity-40">Monitoring</div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Leadership Team */}
                <div className="mb-40">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-foreground mb-4">
                            Our <span className="text-primary">Leadership.</span>
                        </h2>
                        <p className="text-muted-foreground text-lg">The minds building the future of integrity.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {team.map((member, i) => (
                            <motion.div
                                key={member.name}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="group"
                            >
                                <div className="relative aspect-[3/4] rounded-[2.5rem] overflow-hidden mb-6 border border-border">
                                    <Image
                                        src={member.image}
                                        alt={member.name}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-60 transition-opacity group-hover:opacity-40" />
                                </div>
                                <h3 className="text-2xl font-black tracking-tight text-foreground">{member.name}</h3>
                                <div className="text-primary font-bold text-sm uppercase tracking-widest mb-4">{member.role}</div>
                                <p className="text-muted-foreground text-sm leading-relaxed">{member.bio}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Final CTA */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="text-center p-20 rounded-[4rem] bg-card border border-border backdrop-blur-3xl overflow-hidden relative shadow-2xl"
                >
                    <div className="absolute -top-24 -right-24 h-96 w-96 bg-primary/10 blur-[100px] rounded-full" />
                    <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-foreground mb-12 leading-none relative z-10">
                        Join the standard <br />
                        of <span className="text-primary italic">excellence.</span>
                    </h2>
                    <div className="flex flex-wrap justify-center gap-6 relative z-10">
                        <Button size="lg" asChild className="h-16 px-12 rounded-2xl text-lg font-bold shadow-2xl shadow-primary/30">
                            <Link href="/auth/signup">Get Started Now</Link>
                        </Button>
                        <Button size="lg" variant="outline" asChild className="h-16 px-12 rounded-2xl text-lg font-bold border-border hover:bg-accent/40">
                            <Link href="/contact">Book a Strategy Call</Link>
                        </Button>
                    </div>
                </motion.div>
            </Wrapper>
        </div>
    );
}
