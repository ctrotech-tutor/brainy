"use client"

import { motion } from "framer-motion"
import { Loader2, Sparkles, ShieldCheck } from "lucide-react"

export default function AppLoading() {
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-md">
            <div className="relative">
                {/* Outer Glow */}
                <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full animate-pulse" />

                {/* Spinner Ring */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="relative h-24 w-24 rounded-full border-t-2 border-r-2 border-primary/40 flex items-center justify-center"
                >
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </motion.div>
            </div>

            <div className="mt-8 flex flex-col items-center gap-3 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest">
                    <ShieldCheck className="h-3 w-3" />
                    Registry Handshake
                </div>
                <h3 className="text-xl font-black tracking-tighter text-foreground uppercase">
                    Initializing <span className="text-primary italic">Environment.</span>
                </h3>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">
                    <Sparkles className="h-3 w-3" />
                    Synchronizing administrative parameters
                </div>
            </div>
        </div>
    )
}
