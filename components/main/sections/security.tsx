"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Wrapper } from "@/components/ui/wrapper";
import { securityFeatures, type SecurityFeature } from "@/lib/security-features";
import { SecurityVisual } from "./security-visual";
import { ShieldCheck, Lock, Fingerprint, Zap } from "lucide-react";

const SecuritySection = () => {
  const [activeFeature, setActiveFeature] = useState<SecurityFeature>(
    securityFeatures[0]
  );

  return (
    <section
      id="security"
      className="relative bg-background py-24 sm:py-32 overflow-hidden"
      aria-labelledby="security-heading"
    >
      {/* Premium Background Elements */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(hsl(var(--primary)/0.02)_1px,transparent_1px)] [background-size:32px_32px]" />
      <div className="absolute top-0 right-0 -z-10 h-[600px] w-[600px] bg-primary/5 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 -z-10 h-[600px] w-[600px] bg-primary/5 blur-[120px] rounded-full -translate-x-1/2 translate-y-1/2" />

      <Wrapper>
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-12 lg:gap-24">

          {/* Left Column: Intelligence Hub */}
          <div className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Badge variant="outline" className="mb-8 border-primary/20 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/5">
                <ShieldCheck className="h-4 w-4 mr-2" />
                Uncompromising Governance
              </Badge>

              <h2 id="security-heading" className="text-5xl sm:text-7xl font-black tracking-tighter text-foreground mb-8 leading-[0.9]">
                Academic Integrity, <br />
                <span className="text-primary prose-italics">Redefined.</span>
              </h2>

              <p className="text-xl text-muted-foreground leading-relaxed mb-12 max-w-xl">
                Brainy implements a zero-trust multi-role framework, ensuring that
                every assessment, grade, and record is verifiable, immutable, and
                protected by institutional-grade encryption.
              </p>
            </motion.div>

            {/* Feature Cards / Selectors */}
            <div className="grid gap-4 w-full max-w-md">
              {securityFeatures.map((feature) => (
                <button
                  key={feature.id}
                  onClick={() => setActiveFeature(feature)}
                  className={cn(
                    "group relative flex items-center gap-6 p-6 rounded-3xl border transition-all duration-500 text-left overflow-hidden",
                    activeFeature.id === feature.id
                      ? "bg-card border-primary/20 shadow-2xl shadow-primary/5"
                      : "bg-card/20 border-white/5 hover:bg-card/40"
                  )}
                >
                  <div className={cn(
                    "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-all duration-500",
                    activeFeature.id === feature.id
                      ? "bg-primary text-primary-foreground scale-110 rotate-3"
                      : "bg-secondary text-muted-foreground"
                  )}>
                    <feature.icon className="h-6 w-6" />
                  </div>

                  <div className="flex-1">
                    <h3 className={cn(
                      "text-lg font-bold transition-all",
                      activeFeature.id === feature.id ? "text-foreground" : "text-muted-foreground"
                    )}>
                      {feature.title}
                    </h3>
                  </div>

                  {activeFeature.id === feature.id && (
                    <motion.div
                      layoutId="active-marker"
                      className="h-2 w-2 rounded-full bg-primary"
                    />
                  )}
                </button>
              ))}
            </div>

            <div className="mt-12 flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-emerald-500" />
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">AES-256 Encryption</span>
              </div>
              <div className="h-4 w-px bg-white/5" />
              <div className="flex items-center gap-2">
                <Fingerprint className="h-4 w-4 text-primary" />
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Biometric Ready</span>
              </div>
            </div>
          </div>

          {/* Right Column: The Visual Core */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center order-1 lg:order-2">
            <div className="relative w-full aspect-square max-w-[600px] flex items-center justify-center">
              {/* Dynamic Aura */}
              <div className="absolute inset-0 bg-primary/5 blur-[100px] rounded-full animate-pulse" />

              <SecurityVisual
                features={securityFeatures}
                activeFeature={activeFeature}
                onFeatureHover={setActiveFeature}
              />

              {/* Status Overlay */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeFeature.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute bottom-0 right-0 lg:bottom-10 lg:right-10 p-6 rounded-[2rem] bg-card/60 border border-primary/20 backdrop-blur-3xl shadow-2xl max-w-[280px] hidden md:block"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Live Security Trace</span>
                  </div>
                  <p className="text-xs font-medium text-muted-foreground leading-relaxed">
                    {activeFeature.description}
                  </p>
                  <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-primary">Priority: High</span>
                    <Zap className="h-3 w-3 text-primary animate-bounce" />
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </Wrapper>
    </section>
  );
};

export default SecuritySection;
