"use client";

import { useState, useEffect } from "react";
import { Cookie, X, Check, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

export function CookieConsent() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if user has already made a choice
        const consent = localStorage.getItem("cookie-consent");
        if (!consent) {
            const timer = setTimeout(() => {
                setIsVisible(true);
            }, 2000); // Show after 2 seconds
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAcceptAll = () => {
        localStorage.setItem("cookie-consent", "accepted-all");
        setIsVisible(false);
    };

    const handleRejectAll = () => {
        localStorage.setItem("cookie-consent", "rejected-all");
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 100 }}
                className="fixed bottom-6 left-6 right-6 z-[100] md:left-auto md:right-8 md:max-w-md"
            >
                <div className="relative overflow-hidden rounded-[2.5rem] border border-border bg-card/80 p-6 backdrop-blur-2xl shadow-2xl">
                    {/* Subtle Background Glow */}
                    <div className="absolute -right-10 -top-10 h-32 w-32 bg-primary/5 blur-[50px] rounded-full" />

                    <div className="relative space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent text-primary border border-border">
                                <Cookie className="h-5 w-5" />
                            </div>
                            <div className="space-y-0.5">
                                <h3 className="text-sm font-black uppercase tracking-widest text-foreground">
                                    Cookie <span className="text-primary">Policy</span>
                                </h3>
                                <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-tight">
                                    <Shield className="h-3 w-3" />
                                    GDPR & Privacy Compliant
                                </div>
                            </div>
                            <button
                                onClick={() => setIsVisible(false)}
                                className="ml-auto text-muted-foreground/40 hover:text-foreground transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <p className="text-xs font-medium leading-relaxed text-muted-foreground">
                            We use cryptographic cookies to enhance your institutional experience, perform security audits, and optimize our operating system performance. By continuing, you agree to our standard protocol.
                        </p>

                        <div className="flex flex-col gap-2 pt-2 sm:flex-row">
                            <Button
                                onClick={handleAcceptAll}
                                className="h-11 rounded-xl bg-primary px-6 text-xs font-black uppercase tracking-widest text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all hover:scale-[1.02]"
                            >
                                <Check className="mr-2 h-3 w-3" />
                                Initialize
                            </Button>
                            <Button
                                onClick={handleRejectAll}
                                variant="outline"
                                className="h-11 rounded-xl border-border bg-muted/20 px-6 text-xs font-black uppercase tracking-widest transition-all hover:bg-muted/30"
                            >
                                Essential Only
                            </Button>
                        </div>

                        <div className="text-center">
                            <a
                                href="/privacy"
                                className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/30 hover:text-primary transition-colors underline underline-offset-4 decoration-primary/20"
                            >
                                Technical Specifications & Privacy Protocol
                            </a>
                        </div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
