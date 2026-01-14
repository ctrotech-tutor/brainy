"use client";

import React, { useState, useEffect } from "react";
import { Wrapper } from "@/components/ui/wrapper";
import { motion, AnimatePresence } from "framer-motion";
import { STEPS } from "@/lib/steps";
import {
  ChevronRight,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap,
  LayoutDashboard
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function HowItWorksSection() {
  const [activeStep, setActiveStep] = useState(0);

  // Auto-play steps for a more dynamic feel
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % STEPS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const currentStep = STEPS[activeStep];

  return (
    <section id="how-it-works" className="relative bg-background py-24 sm:py-32 overflow-hidden" aria-labelledby="how-it-works-heading">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 -z-10 h-[600px] w-[600px] rounded-full bg-primary/5 blur-[120px]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(hsl(var(--foreground)/2%)_1px,transparent_1px)] [background-size:40px_40px] opacity-30" />

      <Wrapper>
        <div className="mx-auto max-w-4xl text-center mb-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest mb-8">
              <Zap className="h-3 w-3" />
              Seamless Workflow
            </div>
            <h2 id="how-it-works-heading" className="text-5xl sm:text-7xl font-black tracking-tighter text-foreground mb-8 leading-[0.9]">
              From Signup to <span className="text-primary prose-italics">Mastery.</span>
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              A high-integrity ecosystem designed for speed, security, and
              verifiable academic results in three strategic phases.
            </p>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Navigation Steps */}
          <div className="space-y-6">
            {STEPS.map((step, idx) => (
              <button
                key={step.id}
                onClick={() => setActiveStep(idx)}
                className={cn(
                  "group relative w-full text-left p-8 rounded-[2.5rem] border transition-all duration-500 overflow-hidden",
                  activeStep === idx
                    ? "bg-card border-primary/20 shadow-2xl shadow-primary/5"
                    : "bg-card/20 border-white/5 hover:bg-card/40"
                )}
              >
                {/* Progress highlight */}
                {activeStep === idx && (
                  <motion.div
                    layoutId="active-bg"
                    className="absolute inset-0 bg-primary/5 -z-10"
                  />
                )}

                <div className="flex items-start gap-6">
                  <div className={cn(
                    "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl font-black text-xl transition-all duration-500",
                    activeStep === idx
                      ? "bg-primary text-primary-foreground scale-110 rotate-3"
                      : "bg-secondary text-muted-foreground group-hover:scale-105"
                  )}>
                    0{step.id}
                  </div>
                  <div>
                    <h3 className={cn(
                      "text-xl font-black tracking-tight mb-2 transition-colors",
                      activeStep === idx ? "text-foreground" : "text-muted-foreground"
                    )}>
                      {step.short}
                    </h3>
                    <p className={cn(
                      "text-sm leading-relaxed transition-colors line-clamp-2",
                      activeStep === idx ? "text-muted-foreground" : "text-muted-foreground/40"
                    )}>
                      {step.title}
                    </p>
                  </div>
                </div>

                {activeStep === idx && (
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 6, ease: "linear" }}
                    className="absolute bottom-0 left-0 h-1 bg-primary/30"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Right: Visual Showcase */}
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, x: 20, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -20, scale: 0.95 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="rounded-[3rem] bg-card/40 border border-white/10 p-10 md:p-16 backdrop-blur-2xl shadow-2xl relative overflow-hidden"
              >
                {/* Decorative glow */}
                <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-primary/20 blur-3xl opacity-50" />

                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                      {activeStep === 0 && <ShieldCheck className="h-5 w-5" />}
                      {activeStep === 1 && <LayoutDashboard className="h-5 w-5" />}
                      {activeStep === 2 && <Sparkles className="h-5 w-5" />}
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest text-primary">Key Phase: 0{activeStep + 1}</span>
                  </div>

                  <h3 className="text-3xl md:text-4xl font-black tracking-tight text-foreground mb-6 leading-tight">
                    {currentStep.title}
                  </h3>
                  <p className="text-lg text-muted-foreground mb-10 leading-relaxed font-medium">
                    {currentStep.description}
                  </p>

                  <div className="grid gap-4 mb-12">
                    {currentStep.bullets?.map((bullet, idx) => (
                      <div key={idx} className="flex items-center gap-4 group/bullet">
                        <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover/bullet:scale-110 transition-transform">
                          <CheckCircle2 className="h-4 w-4" />
                        </div>
                        <span className="text-base font-bold text-foreground/80">{bullet}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-4 pt-8 border-t border-white/5">
                    <Link
                      href="/get-started"
                      className="px-8 py-4 rounded-2xl bg-primary text-primary-foreground font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 hover:scale-105 transition-all flex items-center gap-2"
                    >
                      Experience it
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                    <Link
                      href="/docs"
                      className="px-8 py-4 rounded-2xl bg-card border border-white/10 text-muted-foreground font-black uppercase tracking-widest text-xs hover:bg-card/60 transition-all"
                    >
                      View Documentation
                    </Link>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Floaties */}
            <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-3xl bg-secondary/30 backdrop-blur-xl border border-white/5 flex items-center justify-center -rotate-12 animate-pulse">
              <span className="text-2xl font-black text-primary">99%</span>
            </div>
          </div>
        </div>
      </Wrapper>
    </section>
  );
}
