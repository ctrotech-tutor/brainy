// components/main/sections/institution-system-section.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wrapper } from "@/components/ui/wrapper";
import { hierarchyData, type HierarchyNode } from "@/lib/hierarchy";

// --- 1. Import the real HierarchyVisual component ---
import { HierarchyVisual } from "./hierarchy-visual";

const InstitutionSystemSection = () => {
  const [selectedNode, setSelectedNode] = useState<HierarchyNode>(hierarchyData);

  return (
    <section className="bg-background py-20 sm:py-28">
      <Wrapper>
        {/* Section Header (no changes) */}
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tighter text-foreground sm:text-4xl md:text-5xl">
            Built for Real Institutions
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            A robust, institution-centric design from the ground up.
          </p>
        </div>

        {/* Main two-column grid (no changes) */}
        <div className="mt-20 grid grid-cols-1 items-center gap-16 lg:grid-cols-2 lg:gap-24">
          {/* Left Column: The Interactive Visual */}
          <div className="flex items-center justify-center">
            {/* --- 2. Replace the placeholder with the real component --- */}
            {/* We pass the data down and provide the onNodeSelect callback function. */}
            {/* When a node is clicked in the visual, it will call setSelectedNode here. */}
            <HierarchyVisual data={hierarchyData} onNodeSelect={setSelectedNode} />
          </div>

          {/* Right Column: The Content Display (no changes) */}
          <div className="relative flex min-h-62.5 flex-col justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedNode.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } }}
                exit={{ opacity: 0, y: -15, transition: { duration: 0.2, ease: "easeIn" } }}
                className="flex flex-col"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                    <selectedNode.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">
                    {selectedNode.name}
                  </h3>
                </div>
                <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
                  {selectedNode.description}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </Wrapper>
    </section>
  );
};

export default InstitutionSystemSection;
