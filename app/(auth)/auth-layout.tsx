"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Sparkles, ShieldCheck, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { BackgroundDecor } from "@/components/core/background-decor";

export function AuthBrandingPanel() {
  return (
    <aside className="relative hidden lg:flex flex-col overflow-hidden bg-card/20 border-r border-white/5">
      {/* Premium Background */}
      <BackgroundDecor variant="emerald" className="opacity-40" />

      {/* Back Arrow */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="absolute left-10 top-10 z-20"
      >
        <Link
          href="/"
          className="group inline-flex items-center gap-2.5 text-sm font-black uppercase tracking-widest text-muted-foreground transition-all hover:text-primary"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary/50 group-hover:bg-primary/10 transition-colors">
            <ArrowLeft className="h-4 w-4" />
          </div>
          Back to Hub
        </Link>
      </motion.div>

      {/* Main Branding Content */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-16 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="space-y-12"
        >
          {/* Logo with Glow */}
          <div className="relative mx-auto h-32 w-32 filter drop-shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)]">
            <Image
              src="/brainy-logo-monochrome.png"
              alt="Brainy logo"
              fill
              priority
              className="object-contain invert dark:invert-0"
            />
          </div>

          <div className="space-y-6">
            <h1 className="text-5xl font-black tracking-tighter text-foreground leading-[0.9]">
              The Standard for <br />
              <span className="text-primary prose-italics">Academic Trust.</span>
            </h1>
            <p className="mx-auto max-w-sm text-lg font-medium leading-relaxed text-muted-foreground/80">
              Unifying security, analytics, and integrity into one seamless institutional experience.
            </p>
          </div>

          {/* Feature Badges */}
          <div className="flex justify-center gap-4">
            {[
              { icon: ShieldCheck, label: "Verifiable" },
              { icon: Zap, label: "AI-Powered" },
              { icon: Sparkles, label: "Premium" }
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                <feature.icon className="h-3 w-3 text-primary" />
                {feature.label}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Glass Footer Overlay */}
      <footer className="relative z-10 p-10 mt-auto border-t border-white/5 backdrop-blur-sm bg-white/2">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-muted-foreground/40">
          <span>Brainy OS v1.0.2</span>
          <span>© {new Date().getFullYear()} Ctrotech</span>
        </div>
      </footer>
    </aside>
  );
}
