"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Shield, Lock, Eye, CheckCircle, Fingerprint, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SecurityFeature } from "@/lib/security-features";
import { useState, useEffect } from "react";

export const SecurityVisual = ({
  features,
  activeFeature,
  onFeatureHover,
}: {
  features: SecurityFeature[];
  activeFeature: SecurityFeature;
  onFeatureHover: (feature: SecurityFeature) => void;
}) => {
  // Fix: Generate positions only on client side
  const [particlePositions, setParticlePositions] = useState<
    Array<{ top: string; left: string }>
  >([]);

  useEffect(() => {
    // Generate random positions only on client
    const positions = Array(6)
      .fill(null)
      .map(() => ({
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
      }));
    setParticlePositions(positions);
  }, []);

  return (
    <div className="relative flex h-[400px] w-full max-w-[500px] items-center justify-center lg:h-[500px]">
      {/* Background Decorative Rings */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-[300px] w-[300px] rounded-full border border-primary/5 animate-slow-spin lg:h-[400px] lg:w-[400px]" />
        <div className="absolute h-[200px] w-[200px] rounded-full border border-primary/10 animate-reverse-slow-spin lg:h-[300px] lg:w-[300px]" />
      </div>

      {/* Central Shield Hub */}
      <motion.div
        animate={{
          scale: [1, 1.02, 1],
          boxShadow: [
            "0 0 40px -10px hsl(var(--primary)/20%)",
            "0 0 60px -5px hsl(var(--primary)/40%)",
            "0 0 40px -10px hsl(var(--primary)/20%)",
          ],
        }}
        transition={{ duration: 4, repeat: Infinity }}
        className="relative z-10 flex h-40 w-40 items-center justify-center rounded-[3rem] bg-card border border-white/10 lg:h-56 lg:w-56 overflow-hidden"
      >
        <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-primary/5" />

        {/* Scanning Matrix Effect */}
        <div className="absolute inset-0 opacity-20">
          <motion.div
            animate={{ y: ["-100%", "100%"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="h-[2px] w-full bg-primary shadow-[0_0_15px_hsl(var(--primary))]"
          />
        </div>

        <div className="flex flex-col items-center gap-2">
          <Shield className="h-16 w-16 text-primary lg:h-24 lg:w-24 drop-shadow-2xl" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/60">
            System Secure
          </span>
        </div>
      </motion.div>

      {/* Interactive Feature Nodes */}
      {features.map((feature, index) => {
        const isActive = activeFeature.id === feature.id;
        // Fixed: Use deterministic positions that will match on server and client
        const positions = [
          "top-0 left-0",
          "top-0 right-0",
          "bottom-0 left-0",
          "bottom-0 right-0",
          "top-1/2 -left-12 -translate-y-1/2",
        ];

        return (
          <motion.div
            key={feature.id}
            onMouseEnter={() => onFeatureHover(feature)}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className={cn(
              "absolute z-20 flex cursor-pointer flex-col items-center gap-2 p-4 transition-all duration-500",
              positions[index % positions.length]
            )}
          >
            <div
              className={cn(
                "flex h-16 w-16 items-center justify-center rounded-2xl border transition-all duration-500 backdrop-blur-xl lg:h-20 lg:w-20",
                isActive
                  ? "bg-primary text-primary-foreground border-primary shadow-2xl shadow-primary/40 scale-110 -rotate-3"
                  : "bg-card/40 text-muted-foreground border-white/5 hover:bg-card hover:border-primary/20"
              )}
            >
              <feature.icon className="h-8 w-8" />
            </div>

            {/* Pulsing Dot */}
            <div
              className={cn(
                "h-1.5 w-1.5 rounded-full transition-all duration-300",
                isActive ? "bg-primary scale-150 animate-pulse" : "bg-white/10"
              )}
            />
          </motion.div>
        );
      })}

      {/* Floating Security Particles - FIXED */}
      {particlePositions.map((pos, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 3 + i,
            repeat: Infinity,
            delay: i * 0.5,
          }}
          className="absolute h-1 w-1 rounded-full bg-primary"
          style={{
            top: pos.top,
            left: pos.left,
          }}
        />
      ))}
    </div>
  );
};