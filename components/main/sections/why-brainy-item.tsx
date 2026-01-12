// components/main/sections/why-brainy-item.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import type { Reason } from "@/lib/why-brainy";

type ReasonItemProps = {
  reason: Reason;
  isActive: boolean;
  onSelect: () => void;
};

export const ReasonItem = ({ reason, isActive, onSelect }: ReasonItemProps) => {
  return (
    <motion.div
      // The `layout` prop is the star here. It automatically animates
      // changes in size and position, creating a smooth accordion effect.
      layout
      // We trigger the `onSelect` callback on both hover and click for
      // a great experience on desktop and mobile.
      onHoverStart={onSelect}
      onClick={onSelect}
      className="cursor-pointer overflow-hidden rounded-xl border"
      // Animate the background and border colors based on the active state.
      animate={{
        backgroundColor: isActive ? "hsl(var(--background))" : "hsl(var(--card))",
        borderColor: isActive ? "hsl(var(--primary))" : "hsl(var(--border))",
      }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <motion.div layout className="flex items-center gap-4 p-4">
        <reason.icon
          className={cn(
            "h-6 w-6 shrink-0 transition-colors duration-300",
            isActive ? "text-primary" : "text-muted-foreground"
          )}
        />
        <h3 className="flex-1 text-lg font-semibold text-foreground">
          {reason.title}
        </h3>
      </motion.div>

      {/* AnimatePresence handles the smooth appearance and disappearance of the description. */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            layout="position"
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{
              opacity: 1,
              y: 0,
              height: "auto",
              transition: { duration: 0.3, ease: "easeOut" },
            }}
            exit={{
              opacity: 0,
              y: -10,
              height: 0,
              transition: { duration: 0.2, ease: "easeIn" },
            }}
            className="px-4 pb-4"
          >
            <p className="text-muted-foreground">{reason.description}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
