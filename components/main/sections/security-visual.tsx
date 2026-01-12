// components/main/sections/security-visual.tsx
"use client";

import { motion } from "framer-motion";
import { Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SecurityFeature } from "@/lib/security-features";

export const SecurityVisual = ({
  features,
  activeFeature,
  onFeatureHover,
}: {
  features: SecurityFeature[];
  activeFeature: SecurityFeature;
  onFeatureHover: (feature: SecurityFeature) => void;
}) => {
  // Calculate the angle for each icon to be placed on the circle
  const angleIncrement = 360 / features.length;

  return (
    <div className="relative flex h-80 w-80 items-center justify-center lg:h-96 lg:w-96">
      {/* Central Shield Element */}
      <motion.div
        // Animate the scale of the shield when a feature becomes active
        animate={{ scale: 1.05 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 20,
          repeat: Infinity,
          repeatType: "mirror",
          duration: 2,
        }}
        className="absolute flex h-32 w-32 items-center justify-center rounded-full bg-card shadow-2xl lg:h-40 lg:w-40"
      >
        {/* Inner glow effect */}
        <div className="absolute inset-0 rounded-full bg-primary/10" />
        <Shield className="h-12 w-12 text-primary lg:h-16 lg:w-16" />
        {/* Outer pulsing glow */}
        <div className="absolute inset-0 -z-10 animate-pulse rounded-full bg-primary/20 blur-xl" />
      </motion.div>

      {/* Orbiting Feature Icons */}
      {features.map((feature, index) => {
        const angle = angleIncrement * index;
        const isActive = activeFeature.id === feature.id;

        return (
          <motion.div
            key={feature.id}
            // The `onHoverStart` event is how this component communicates back to its parent
            onHoverStart={() => onFeatureHover(feature)}
            className="absolute flex h-16 w-16 cursor-pointer items-center justify-center rounded-full bg-card/80 p-3 backdrop-blur-md lg:h-20 lg:w-20"
            style={{
              // Position icons in a circle using transform
              transform: `rotate(${angle}deg) translate(150px) rotate(${-angle}deg)`,
            }}
            // Animate the icon when it becomes active
            animate={{
              scale: isActive ? 1.25 : 1,
              boxShadow: isActive
                ? "0 0 0 2px hsl(var(--primary)/0.8), 0 0 20px hsl(var(--primary)/0.5)"
                : "0 0 0 1px hsl(var(--border))",
            }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
          >
            <feature.icon
              className={cn(
                "h-full w-full transition-colors duration-300",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            />
          </motion.div>
        );
      })}
    </div>
  );
};
