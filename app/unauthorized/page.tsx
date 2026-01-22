"use client";

import { ShieldX, ArrowLeft, Home, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BackgroundDecor } from "@/components/core/background-decor";

export default function UnauthorizedPage() {
    return (
        <div className="relative min-h-screen w-full bg-background flex items-center justify-center overflow-hidden p-4">
            <BackgroundDecor variant="emerald" />

            <div className="relative z-10 w-full max-w-2xl">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="relative p-8 md:p-12 rounded-[3rem] bg-card/30 border border-white/5 backdrop-blur-3xl shadow-2xl text-center overflow-hidden"
                >
                    {/* Decorative Ring */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-white/5 rounded-full pointer-events-none" />

                    <div className="space-y-8">
                        {/* Visual Icon */}
                        <div className="relative mx-auto h-24 w-24 flex items-center justify-center rounded-[2rem] bg-destructive/10 border border-destructive/20 shadow-2xl shadow-destructive/20">
                            <ShieldX className="h-12 w-12 text-destructive" />
                            <motion.div
                                animate={{ opacity: [0.3, 0.6, 0.3] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="absolute inset-0 bg-destructive/20 blur-2xl rounded-full"
                            />
                        </div>

                        {/* Error Message */}
                        <div className="space-y-3">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-destructive/10 border border-destructive/20 text-destructive text-[10px] font-black uppercase tracking-widest">
                                Security Protocol 403
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-foreground leading-[1.1]">
                                Access <span className="text-destructive italic">Denied.</span>
                            </h1>
                            <p className="text-sm md:text-base font-medium text-muted-foreground/60 max-w-md mx-auto leading-relaxed">
                                Your current credentials lack the administrative clearance levels required to interface with this node.
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                            <Button
                                asChild
                                className="h-14 px-8 rounded-2xl bg-destructive text-destructive-foreground font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-destructive/20 hover:scale-[1.02] active:scale-95 transition-all w-full sm:w-auto"
                            >
                                <Link href="/">
                                    <Home className="mr-2 h-4 w-4" />
                                    Return to Home
                                </Link>
                            </Button>

                            <Button
                                asChild
                                variant="outline"
                                className="h-14 px-8 rounded-2xl border-white/10 bg-white/5 font-black uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all w-full sm:w-auto"
                            >
                                <Link href="/onboarding/institution/details">
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Registry Node
                                </Link>
                            </Button>
                        </div>

                        {/* Footer Tag */}
                        <div className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/30 pt-4">
                            <Sparkles className="h-3 w-3" />
                            Auth Integrity Vault Active
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
