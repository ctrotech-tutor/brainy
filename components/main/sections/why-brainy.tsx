// components/main/sections/why-brainy-section.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wrapper } from "@/components/ui/wrapper";
import { whyBrainyReasons, type Reason } from "@/lib/why-brainy";

// --- 1. Import the real ReasonItem component ---
import { ReasonItem } from "./why-brainy-item";

const WhyBrainySection = () => {
  const [activeReason, setActiveReason] = useState<Reason>(whyBrainyReasons[0]);
  const ActiveVisual = activeReason.visual;

  return (
    <section id="why-brainy" className="bg-background/50 py-20 sm:py-28">
      <Wrapper>
        {/* Section Header (no changes) */}
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tighter text-foreground sm:text-4xl md:text-5xl">
            Why Brainy?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            More than just a quiz tool, Brainy is a complete academic
            assessment ecosystem.
          </p>
        </div>

        {/* Main two-column grid (no changes) */}
        <div className="mt-20 grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Left Column: The list of reasons */}
          <div className="flex flex-col gap-4">
            {whyBrainyReasons.map((reason) => (
              // --- 2. Replace the placeholder with the real component ---
              <ReasonItem
                key={reason.id}
                reason={reason}
                isActive={activeReason.id === reason.id}
                onSelect={() => setActiveReason(reason)}
              />
            ))}
          </div>

          {/* Right Column: The "Lens" Visual Display (no changes) */}
          <div className="relative h-96 items-center justify-center rounded-2xl bg-card p-8 shadow-xl lg:h-112.5 hidden md:flex">
            <div className="absolute inset-0 z-0 bg-[radial-gradient(hsl(var(--muted))_1px,transparent_1px)] bg-size-[24px_24px]" />
            <AnimatePresence mode="wait">
              <motion.div
                key={activeReason.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }}
                exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } }}
                className="relative z-10 flex items-center justify-center"
              >
                <ActiveVisual />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </Wrapper>
    </section>
  );
};

export default WhyBrainySection;
