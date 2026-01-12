// components/main/sections/hierarchy-visual.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { HierarchyNode as HierarchyNodeType } from "@/lib/hierarchy";

// --- The Recursive Node Component ---
// This component is the heart of the visual. It renders a single node and its children.
const HierarchyNode = ({
  node,
  onNodeSelect,
  level = 0,
}: {
  node: HierarchyNodeType;
  onNodeSelect: (node: HierarchyNodeType) => void;
  level: number;
}) => {
  // Each node manages its own expanded/collapsed state.
  // We'll auto-expand the first two levels for a better initial view.
  const [isExpanded, setIsExpanded] = useState(level < 2);

  const hasChildren = node.children && node.children.length > 0;

  const handleNodeClick = () => {
    if (hasChildren) {
      setIsExpanded(!isExpanded);
    }
    onNodeSelect(node);
  };

  return (
    // The `layout` prop from Framer Motion is key. It automatically animates position changes.
    <motion.div layout="position" className="relative flex flex-col items-start">
      {/* The clickable node element */}
      <motion.button
        layout
        onClick={handleNodeClick}
        className={cn(
          "group flex w-full items-center gap-3 rounded-lg border bg-card p-3 text-left transition-colors duration-200 hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring",
          // Add a subtle glow effect on the border
          "shadow-[0_0_0_1px_hsl(var(--border))] hover:shadow-[0_0_0_1px_hsl(var(--primary)/0.5)]"
        )}
      >
        <node.icon className="h-5 w-5 shrink-0 text-primary" />
        <span className="flex-1 text-sm font-medium text-foreground">{node.name}</span>
        {/* Show a chevron icon if the node has children */}
        {hasChildren && (
          <ChevronDown
            className={cn(
              "h-4 w-4 text-muted-foreground transition-transform duration-300",
              isExpanded && "rotate-180"
            )}
          />
        )}
      </motion.button>

      {/* --- Children Rendering --- */}
      {/* AnimatePresence handles the smooth appearance and disappearance of the children block. */}
      <AnimatePresence initial={false}>
        {isExpanded && hasChildren && (
          <motion.div
            // This div contains the connecting line and the children nodes.
            className="relative mt-4 ml-6 flex flex-col gap-4 border-l-2 border-dashed border-border pl-8"
            initial={{ opacity: 0, height: 0 }}
            animate={{
              opacity: 1,
              height: "auto",
              transition: { duration: 0.3, ease: "easeOut" },
            }}
            exit={{
              opacity: 0,
              height: 0,
              transition: { duration: 0.2, ease: "easeIn" },
            }}
          >
            {/* Recursion: Render a HierarchyNode for each child */}
            {node.children?.map((child) => (
              <HierarchyNode
                key={child.id}
                node={child}
                onNodeSelect={onNodeSelect}
                level={level + 1}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};


// --- The Main Exported Component ---
// This is a simple wrapper that starts the recursive rendering process.
export const HierarchyVisual = ({
  data,
  onNodeSelect,
}: {
  data: HierarchyNodeType;
  onNodeSelect: (node: HierarchyNodeType) => void;
}) => {
  return <HierarchyNode node={data} onNodeSelect={onNodeSelect} level={0} />;
};
