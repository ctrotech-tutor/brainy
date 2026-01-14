"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BackgroundDecorProps {
    className?: string;
    variant?: "default" | "subtle" | "emerald";
}

export const BackgroundDecor = ({ className, variant = "default" }: BackgroundDecorProps) => {
    return (
        <div className={cn("absolute inset-0 -z-10 overflow-hidden pointer-events-none", className)}>
            {/* 1. Base Grid Pattern */}
            <div
                className={cn(
                    "absolute inset-0 transition-opacity duration-1000",
                    variant === "emerald"
                        ? "bg-[radial-gradient(hsl(var(--emerald-500)/0.03)_1px,transparent_1px)]"
                        : "bg-[radial-gradient(hsl(var(--primary)/0.03)_1px,transparent_1px)]",
                    "[background-size:40px_40px]"
                )}
            />

            {/* 2. Top-Right Glowing Blob */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className={cn(
                    "absolute -top-1/4 -right-1/4 h-[700px] w-[700px] rounded-full blur-[120px]",
                    variant === "emerald" ? "bg-emerald-500/10" : "bg-primary/5"
                )}
            />

            {/* 3. Bottom-Left Glowing Blob */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 2, ease: "easeOut", delay: 0.2 }}
                className={cn(
                    "absolute -bottom-1/4 -left-1/4 h-[600px] w-[600px] rounded-full blur-[100px]",
                    variant === "emerald" ? "bg-emerald-500/5" : "bg-primary/5"
                )}
            />

            {/* 4. Center Ambient Glow (Only for default) */}
            {variant === "default" && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[800px] w-full bg-primary/2 blur-[140px] opacity-50" />
            )}
        </div>
    );
};
