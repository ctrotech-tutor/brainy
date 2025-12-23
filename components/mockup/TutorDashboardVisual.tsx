"use client";

import { motion } from "framer-motion";
import { Users } from "lucide-react";
import { cn } from "@/lib/utils";

const TutorDashboardVisual = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true }}
      className="relative w-full max-w-md select-none"
    >
      {/* Ambient Glow */}
      <div className="absolute -inset-6 rounded-3xl bg-linear-to-tr from-primary/30 via-indigo-500/20 to-cyan-400/20 blur-3xl opacity-70" />

      {/* Visual Mockup */}
      <div
        className={cn(
          "relative overflow-hidden rounded-3xl",
          "bg-linear-to-br from-background/70 to-background/30",
          "backdrop-blur-2xl border border-white/10",
          "shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]"
        )}
      >
        {/* Grain Overlay */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.08] mix-blend-overlay bg-[url('/noise.png')]" />

        <div className="p-6 space-y-6">
          {/* Header */}
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">
              Tutor Dashboard
            </p>
            <h3 className="text-sm font-semibold text-foreground/80">
              Class Overview
            </h3>
          </div>

          {/* Main Stat */}
          <div className="flex items-center gap-4 rounded-2xl bg-white/5 p-4 backdrop-blur-md">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15">
              <Users className="h-5 w-5 text-primary" />
            </div>

            <div>
              <p className="text-2xl font-bold text-foreground/90">
                42 / 50
              </p>
              <p className="text-xs text-muted-foreground">
                Active Students
              </p>
            </div>
          </div>

          {/* Progress (visual only) */}
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Class Average</span>
                <span className="text-foreground/70">78%</span>
              </div>
              <div className="mt-2 h-1.5 w-full rounded-full bg-white/10">
                <div className="h-full w-[78%] rounded-full bg-linear-to-r from-primary to-purple-500 opacity-80" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Completion Rate</span>
                <span className="text-foreground/70">92%</span>
              </div>
              <div className="mt-2 h-1.5 w-full rounded-full bg-white/10">
                <div className="h-full w-[92%] rounded-full bg-linear-to-r from-emerald-400 to-cyan-400 opacity-80" />
              </div>
            </div>
          </div>

          {/* Faux Footer */}
          <div className="pt-3 text-center text-[11px] text-muted-foreground">
            Performance insights update automatically
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TutorDashboardVisual;
