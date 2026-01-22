"use client";

import { useState } from "react";
import { Wrapper } from "@/components/ui/wrapper";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
    Check,
    Zap,
    Building2,
    Users,
    Globe,
    ArrowRight
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const tiers = [
    {
        name: "Independent Student",
        id: "tier-student",
        href: "/auth/signup?intent=student",
        price: { monthly: "$0", yearly: "$0" },
        description: "Perfect for students looking to verify their skills globally.",
        features: [
            "Access to public mocks",
            "Global integrity rank",
            "Digital student badge",
            "Up to 5 individual attempts/mo",
            "Basic performance insights",
        ],
        cta: "Join as Student",
        highlight: false,
        icon: Users
    },
    {
        name: "Institutional Pro",
        id: "tier-institution",
        href: "/auth/signup?intent=institution",
        price: { monthly: "$49", yearly: "$490" },
        description: "The complete OS for departments and small schools.",
        features: [
            "Unlimited student enrollments",
            "Institutional verification badge",
            "AI-Assisted quiz generation",
            "Advanced cheating detection",
            "Full performance analytics",
            "Department management",
            "Role-based access control",
        ],
        cta: "Register Institution",
        highlight: true,
        icon: Building2
    },
    {
        name: "Enterprise Global",
        id: "tier-enterprise",
        href: "/contact",
        price: { monthly: "Custom", yearly: "Custom" },
        description: "Bespoke infrastructure for universities and governments.",
        features: [
            "Dedicated account manager",
            "Custom security protocols",
            "On-premise hosting options",
            "API access for LRS integration",
            "White-label possibilities",
            "24/7 priority support",
            "Bulk student onboarding",
        ],
        cta: "Contact Enterprise",
        highlight: false,
        icon: Globe
    }
];

export default function PricingSection() {
    const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

    return (
        <section className="relative isolate overflow-hidden py-24 sm:py-32" id="pricing">
            <Wrapper>
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-6">
                            <Zap className="h-3 w-3" />
                            Flexible Plans
                        </div>
                        <h2 className="text-5xl sm:text-7xl font-black tracking-tighter text-foreground mb-8">
                            Predictable pricing for <span className="text-primary italic">modern education.</span>
                        </h2>
                        <p className="text-xl text-muted-foreground leading-relaxed">
                            Choose the path that fits your academic goals. From individual students
                            to global organizations, Brainy scales with you.
                        </p>
                    </motion.div>

                    {/* Billing Toggle */}
                    <div className="mt-12 flex items-center justify-center gap-4">
                        <span className={cn(
                            "text-sm font-bold transition-colors",
                            billingCycle === "monthly" ? "text-foreground" : "text-muted-foreground"
                        )}>Monthly</span>
                        <button
                            onClick={() => setBillingCycle(prev => prev === "monthly" ? "yearly" : "monthly")}
                            className="relative w-14 h-8 rounded-full bg-card border border-border p-1 transition-colors hover:border-primary/50"
                        >
                            <motion.div
                                animate={{ x: billingCycle === "monthly" ? 0 : 24 }}
                                className="w-6 h-6 rounded-full bg-primary shadow-lg shadow-primary/30"
                            />
                        </button>
                        <span className={cn(
                            "text-sm font-bold transition-colors",
                            billingCycle === "yearly" ? "text-foreground" : "text-muted-foreground"
                        )}>Yearly</span>
                        <div className="ml-2 px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-bold uppercase tracking-wider">
                            Save 20%
                        </div>
                    </div>
                </div>

                {/* Pricing Grid */}
                <div className="grid lg:grid-cols-3 gap-8 items-stretch">
                    {tiers.map((tier, idx) => (
                        <motion.div
                            key={tier.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            className={cn(
                                "relative group flex flex-col p-10 rounded-[3rem] bg-card border transition-all duration-500 hover:bg-accent/40",
                                tier.highlight
                                    ? "border-primary/30 shadow-[0_0_80px_-20px_rgba(var(--primary-rgb),0.15)] scale-105 z-10"
                                    : "border-border hover:border-primary/20"
                            )}
                        >
                            {tier.highlight && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-black uppercase tracking-widest shadow-xl">
                                    Most Popular
                                </div>
                            )}

                            <div className="flex items-center gap-4 mb-8">
                                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                    <tier.icon className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-foreground">{tier.name}</h3>
                                    <div className="text-xs text-muted-foreground uppercase tracking-widest font-black">
                                        {tier.highlight ? "Best Value" : "Plan"}
                                    </div>
                                </div>
                            </div>

                            <div className="mb-8">
                                <div className="flex items-baseline gap-1">
                                    <span className="text-5xl font-black text-foreground tracking-tighter">
                                        {billingCycle === "monthly" ? tier.price.monthly : tier.price.yearly}
                                    </span>
                                    {tier.price.monthly !== "Custom" && (
                                        <span className="text-muted-foreground font-bold">/{billingCycle === "monthly" ? "mo" : "yr"}</span>
                                    )}
                                </div>
                                <p className="mt-4 text-sm text-muted-foreground leading-relaxed h-10">
                                    {tier.description}
                                </p>
                            </div>

                            <div className="space-y-4 mb-10 flex-grow">
                                {tier.features.map((feature, fIdx) => (
                                    <div key={fIdx} className="flex items-start gap-3">
                                        <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center text-primary mt-0.5 shrink-0">
                                            <Check className="h-3 w-3" />
                                        </div>
                                        <span className="text-sm text-muted-foreground leading-tight">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <Button
                                asChild
                                variant={tier.highlight ? "default" : "outline"}
                                className={cn(
                                    "w-full h-14 rounded-2xl text-md font-bold transition-all hover:scale-[1.02]",
                                    !tier.highlight && "border-border bg-accent/20 hover:bg-accent/40"
                                )}
                            >
                                <Link href={tier.href}>
                                    {tier.cta}
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </motion.div>
                    ))}
                </div>
            </Wrapper>
        </section>
    );
}
