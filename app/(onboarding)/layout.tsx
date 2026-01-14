"use client";

import Link from "next/link";
import { Brain } from "lucide-react";
import { Wrapper } from "@/components/ui/wrapper";
import { BackgroundDecor } from "@/components/core/background-decor";
import { motion } from "framer-motion";

export default function OnboardingRootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="relative flex min-h-screen flex-col bg-background selection:bg-primary/10">
            {/* Unified Background System */}
            <BackgroundDecor variant="emerald" />

            {/* Focused Onboarding Header */}
            <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-background/50 backdrop-blur-xl">
                <Wrapper className="flex h-20 items-center justify-between">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                    >
                        <Link href="/" className="flex items-center gap-2 group transition-opacity hover:opacity-80">
                            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary shadow-sm group-hover:scale-105 transition-transform duration-300">
                                <Brain className="h-6 w-6" />
                            </div>
                            <span className="text-xl font-black uppercase tracking-tighter text-foreground">
                                Brainy.
                            </span>
                        </Link>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
                        className="flex items-center gap-4"
                    >
                        <div className="h-px w-12 bg-white/5 hidden sm:block" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 bg-white/5 px-4 py-2 rounded-full border border-white/5">
                            Account Setup Sequence
                        </span>
                    </motion.div>
                </Wrapper>
            </header>

            {/* Main Stage */}
            <main className="relative z-10 flex flex-1 items-center justify-center py-12 px-6 sm:py-24">
                <Wrapper className="w-full max-w-4xl">
                    {children}
                </Wrapper>
            </main>

            {/* Minimalist Security Footer */}
            <footer className="w-full py-8 border-t border-white/5">
                <Wrapper className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-bold text-muted-foreground/30 uppercase tracking-[0.2em]">
                    <div>© 2026 Brainy Labs. All rights reserved.</div>
                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1.5">
                            <div className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
                            Secure Environment
                        </span>
                        <span className="h-4 w-px bg-white/5" />
                        <span>ISO/IEC 27001 Certified</span>
                    </div>
                </Wrapper>
            </footer>
        </div>
    );
}
