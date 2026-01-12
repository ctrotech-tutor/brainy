// components/main/sections/security-section.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wrapper } from "@/components/ui/wrapper";
import { securityFeatures, type SecurityFeature } from "@/lib/security-features";

// --- 1. Import the real SecurityVisual component ---
import { SecurityVisual } from "./security-visual";

const SecuritySection = () => {
  const [activeFeature, setActiveFeature] = useState<SecurityFeature>(
    securityFeatures[0]
  );

  return (
    <section id="security" className="relative bg-background/50 py-20 sm:py-28 overflow-hidden">
      {/* <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(hsl(var(--primary)/0.15)_1px,transparent_1px)] [background-size:16px_16px]"
      /> */}

      <Wrapper>
        {/* Section Header (no changes) */}
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tighter text-foreground sm:text-4xl md:text-5xl">
            Verified Users. Trusted Results.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Our platform is built on a foundation of security, ensuring data
            integrity and a trusted academic environment from day one.
          </p>
        </div>

        {/* Main two-column grid (no changes) */}
        <div className="mt-6 md:mt-0 grid grid-cols-1 items-center gap-16 lg:grid-cols-2 lg:gap-24">
          {/* Left Column: Animated Text Content (no changes) */}
          <div className="relative flex min-h-75 flex-col justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFeature.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } }}
                exit={{ opacity: 0, x: 20, transition: { duration: 0.3, ease: "easeIn" } }}
                className="space-y-3"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-background">
                  <activeFeature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">
                  {activeFeature.title}
                </h3>
                <p className="leading-relaxed text-muted-foreground">
                  {activeFeature.description}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Column: The Interactive Visual */}
          <div className="items-center justify-center hidden md:flex">
            {/* --- 2. Replace the placeholder with the real component --- */}
            <SecurityVisual
              features={securityFeatures}
              activeFeature={activeFeature}
              onFeatureHover={setActiveFeature}
            />
          </div>
        </div>
      </Wrapper>
    </section>
  );
};

export default SecuritySection;
