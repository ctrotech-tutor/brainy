"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

import { features, type Feature } from "@/lib/features";
import { Wrapper } from "@/components/ui/wrapper";

const FeaturesSection = () => {
  const [selectedFeature, setSelectedFeature] = useState<Feature>(features[0]);

  return (
    <section id="features" className="bg-background py-20 sm:py-28">
      <Wrapper>
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tighter text-foreground sm:text-4xl md:text-5xl">
            A Smarter Way to Learn
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Brainy is packed with powerful features designed to enhance the
            learning experience for both students and educators.
          </p>
        </div>

        {/* Horizontal Scrolling Chip-Tabs */}
        <div className="mt-12 overflow-hidden">
          <div className="flex scroll-p-4 snap-x snap-mandatory_ overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none]">
            {features.map((feature, index) => (
              <div key={feature.title} className="snap-start_ flex-shrink-0 px-2 first:pl-4 last:pr-4">
                <button
                  onClick={() => setSelectedFeature(features[index])}
                  className={cn(
                    "whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition-colors",
                    selectedFeature.title === feature.title
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-secondary text-secondary-foreground hover:bg-accent"
                  )}
                >
                  {feature.title}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Content Display */}
        <div className="mt-8 w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedFeature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="grid grid-cols-1 items-start gap-8 rounded-xl border bg-card p-8 shadow-lg md:grid-cols-3 md:gap-12"
            >
              {/* Left side of the card: Icon and Title */}
              <div className="col-span-1 flex flex-col items-start gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-primary/10">
                  <selectedFeature.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-card-foreground">
                  {selectedFeature.title}
                </h3>
              </div>

              {/* Right side of the card: Description and Sub-features */}
              <div className="md:col-span-2">
                <p className="text-card-foreground/80">
                  {selectedFeature.description}
                </p>
                <ul className="mt-6 space-y-3">
                  {selectedFeature.sub.map((subItem, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-success" />
                      <span className="text-muted-foreground">{subItem}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </Wrapper>
    </section>
  );
};

export default FeaturesSection;
