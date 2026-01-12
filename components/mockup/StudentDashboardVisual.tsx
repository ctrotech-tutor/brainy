"use client";

import { motion } from "framer-motion";
import { BookCheck, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

const StudentDashboardVisual = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative w-full max-w-md"
    >
      {/* Glow */}
      <div className="absolute -inset-6 rounded-3xl bg-linear-to-tr from-primary/30 via-purple-500/20 to-cyan-400/20 blur-3xl opacity-70" />

      {/* Mockup Container */}
      <div
        className={cn(
          "relative overflow-hidden rounded-3xl",
          "bg-linear-to-br from-background/70 to-background/30",
          "backdrop-blur-2xl border border-white/10 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]"
        )}
      >
        {/* Grain overlay (image feel) */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.08] mix-blend-overlay bg-[url('/noise.jpeg')]" />

        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                Student Dashboard
              </p>
              <h3 className="text-sm font-semibold text-foreground/80">
                Learning Progress
              </h3>
            </div>

            <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-[10px] text-emerald-400">
              Active
            </span>
          </div>

          {/* Stat */}
          <div className="rounded-2xl bg-white/5 p-4 backdrop-blur-md">
            <p className="text-xs text-muted-foreground">Overall Progress</p>

            <div className="mt-2 flex items-center gap-2">
              <span className="text-2xl font-bold text-foreground/90">
                82%
              </span>

              <span className="flex items-center gap-1 text-xs text-emerald-400">
                <TrendingUp className="h-3.5 w-3.5" />
                +5%
              </span>
            </div>

            {/* Fake progress bar */}
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-[82%] rounded-full bg-linear-to-r from-primary to-purple-500 opacity-80" />
            </div>
          </div>

          {/* Activity (visual only) */}
          <div className="space-y-3">
            <p className="text-xs font-medium text-muted-foreground">
              Recent Activity
            </p>

            <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15">
                <BookCheck className="h-4 w-4 text-primary" />
              </div>

              <div className="flex-1">
                <p className="text-xs font-medium text-foreground/80">
                  CSC 101 – Final Quiz
                </p>
                <p className="text-[10px] text-muted-foreground">
                  Completed recently
                </p>
              </div>

              <span className="text-xs text-foreground/70">100%</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default StudentDashboardVisual;
