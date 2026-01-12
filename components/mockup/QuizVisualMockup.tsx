"use client";

import { motion } from "framer-motion";
import { BookOpen, Clock, BarChart2 } from "lucide-react";
import { cn } from "@/lib/utils";

const QuizVisualMockup = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true }}
      className="relative w-full max-w-md select-none"
    >
      {/* Ambient Glow */}
      <div className="absolute -inset-6 rounded-3xl bg-linear-to-tr from-primary/30 via-fuchsia-500/20 to-cyan-400/20 blur-3xl opacity-70" />

      {/* Main Visual */}
      <div
        className={cn(
          "relative overflow-hidden rounded-3xl",
          "bg-linear-to-br from-background/70 to-background/30",
          "backdrop-blur-2xl border border-white/10",
          "shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]"
        )}
      >
        {/* Grain Overlay */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.08] mix-blend-overlay bg-[url('/noise.jpeg')]" />

        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>

            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                Quiz Session
              </p>
              <h3 className="text-sm font-semibold text-foreground/80">
                CSC 101 — Introduction to Computing
              </h3>
            </div>
          </div>

          {/* Question */}
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">
              Question 3 of 10
            </p>
            <p className="text-sm font-medium text-foreground/90 leading-snug">
              What is the primary function of an operating system?
            </p>
          </div>

          {/* Options (visual only) */}
          <div className="space-y-3">
            <div className="h-10 rounded-xl bg-muted/60 border border-border dark:bg-white/5 dark:border-white/10" />
            <div className="h-10 rounded-xl bg-muted/60 border border-border dark:bg-white/5 dark:border-white/10" />
            <div className="h-10 rounded-xl opacity-60 bg-muted/60 border border-border dark:bg-white/5 dark:border-white/10" />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>12:45 remaining</span>
            </div>

            {/* Fake Progress */}
            <div className="h-1.5 w-1/3 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-[30%] rounded-full bg-linear-to-r from-primary to-purple-500 opacity-80" />
            </div>
          </div>
        </div>
      </div>

      {/* Floating Analytics */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5, ease: "easeOut" }}
        className="absolute -bottom-6 -right-6 sm:top-4 sm:-right-8"
      >
        <div className="flex items-center gap-3 rounded-2xl bg-background/60 backdrop-blur-xl border border-white/10 p-3 shadow-xl">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent">
            <BarChart2 className="h-4 w-4 text-accent-foreground" />
          </div>
          <div>
            <p className="text-lg font-bold text-foreground/90">87%</p>
            <p className="text-[11px] text-muted-foreground">Avg Score</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default QuizVisualMockup;
