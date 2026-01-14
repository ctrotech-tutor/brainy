// components/main/sections/institution-system-section.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wrapper } from "@/components/ui/wrapper";
import { hierarchyData, type HierarchyNode } from "@/lib/hierarchy";

// --- 1. Import the real HierarchyVisual component ---
import { Badge } from "@/components/ui/badge";
import { HierarchyVisual } from "./hierarchy-visual";

const InstitutionSystemSection = () => {
  const [selectedNode, setSelectedNode] = useState<HierarchyNode>(hierarchyData);

  return (
    <section id="institutions" className="relative bg-background py-24 sm:py-32 overflow-hidden" aria-labelledby="institutions-heading">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(hsl(var(--primary)/0.05)_1px,transparent_1px)] [background-size:32px_32px]" />

      <Wrapper>
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <Badge variant="outline" className="mb-4 border-primary/20 bg-primary/5 text-primary">Enterprise Ready</Badge>
          <h2 id="institutions-heading" className="text-3xl font-bold tracking-tighter text-foreground sm:text-4xl md:text-5xl">
            Streamlined <span className="text-primary">Institution Hierarchy</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            A flexible, multi-tenant architecture designed to model your entire
            academic ecosystem from faculties down to individual courses.
          </p>
        </div>

        {/* Main two-column grid */}
        <div className="mt-20 grid grid-cols-1 items-start gap-16 lg:grid-cols-2 lg:gap-24">
          {/* Left Column: The Interactive Visual */}
          <div className="flex items-center justify-center lg:sticky lg:top-32">
            <div className="relative w-full max-w-sm rounded-[2rem] bg-linear-to-b from-primary/5 to-transparent p-1 shadow-2xl">
              <div className="rounded-[1.9rem] bg-background/80 p-6 backdrop-blur-xl">
                <HierarchyVisual data={hierarchyData} onNodeSelect={setSelectedNode} />
              </div>
            </div>
          </div>

          {/* Right Column: The Content Display */}
          <div className="relative flex flex-col pt-4 lg:pt-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedNode.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col gap-6"
              >
                <div className="flex items-center gap-5">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/20">
                    <selectedNode.icon className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-foreground">
                      {selectedNode.name}
                    </h3>
                    <div className="h-1 w-12 rounded-full bg-primary/40 mt-1" />
                  </div>
                </div>

                <p className="text-lg leading-relaxed text-muted-foreground md:text-xl">
                  {selectedNode.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <div className="rounded-xl border border-border bg-card/50 p-4">
                    <p className="text-sm font-semibold text-primary">Scalable</p>
                    <p className="text-xs text-muted-foreground">Deep nesting for any institutional size.</p>
                  </div>
                  <div className="rounded-xl border border-border bg-card/50 p-4">
                    <p className="text-sm font-semibold text-primary">Granular</p>
                    <p className="text-xs text-muted-foreground">Permission-based access at every level.</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </Wrapper>
    </section>
  );
};

export default InstitutionSystemSection;
