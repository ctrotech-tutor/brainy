// components/main/sections/why-brainy-visuals.tsx
"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// A common wrapper to provide perspective and a consistent container
const VisualWrapper = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div
    style={{ perspective: "1000px" }}
    className={cn("flex h-64 w-64 items-center justify-center", className)}
  >
    {children}
  </div>
);

// --- 1. Built for Real Institutions ---
// A 3D stack of interactive, glowing glass panels representing hierarchy.
export const InstitutionVisual = () => (
  <VisualWrapper>
    <motion.div
      className="relative h-40 w-40"
      initial="initial"
      animate="animate"
      whileHover="hover"
    >
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-full w-full origin-center rounded-2xl border border-white/10 bg-card/30 backdrop-blur-sm"
          variants={{
            initial: { y: 0, rotateX: 60, transformOrigin: "bottom center" },
            animate: {
              y: -i * 25,
              rotateX: 60,
              scale: 1 - i * 0.1,
              transition: { type: "spring", stiffness: 100, damping: 15, delay: i * 0.1 },
            },
            hover: {
              y: -i * 35,
              transition: { type: "spring", stiffness: 200, damping: 15 },
            },
          }}
        />
      ))}
    </motion.div>
  </VisualWrapper>
);

// --- 2. Secure & Verified ---
// A 3D rotating shield with an orbiting lock, signifying layered protection.
export const SecurityVisual = () => (
  <VisualWrapper>
    <motion.div
      className="relative h-40 w-40"
      animate={{ rotateY: [0, 360] }}
      transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* Main Shield Body */}
      <div className="absolute inset-0 rounded-full border-2 border-primary/50" />
      <div className="absolute inset-4 rounded-full bg-primary/10" />
      {/* Orbiting Lock */}
      <motion.div
        className="absolute left-1/2 top-1/2 h-8 w-8"
        style={{ transformStyle: "preserve-3d" }}
        animate={{
          transform: [
            "translate(-50%, -50%) rotateY(0deg) translateZ(100px)",
            "translate(-50%, -50%) rotateY(360deg) translateZ(100px)",
          ],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      >
        <div className="absolute flex h-full w-full items-center justify-center rounded-md bg-card shadow-lg">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
      </motion.div>
    </motion.div>
  </VisualWrapper>
);

// --- 3. Analytics & Insights ---
// A sleek, 3D bar chart with glowing bars that rise from a glass base.
export const AnalyticsVisual = () => (
  <VisualWrapper>
    <motion.div
      className="relative h-32 w-48 rounded-t-xl border-x border-t border-white/10 bg-card/20 p-4"
      style={{ transform: "rotateX(45deg) rotateZ(-20deg)" }}
      initial="initial"
      animate="animate"
    >
      <div className="flex h-full items-end gap-3">
        {[0.4, 0.8, 0.6].map((height, i) => (
          <motion.div
            key={i}
            className="relative w-full rounded-t-md bg-primary"
            variants={{
              initial: { height: 0, opacity: 0 },
              animate: {
                height: `${height * 100}%`,
                opacity: 1,
                transition: { type: "spring", stiffness: 150, damping: 20, delay: i * 0.15 },
              },
            }}
          >
            {/* Add a subtle glow to the top of each bar */}
            <div className="absolute -top-2 left-0 h-2 w-full bg-primary blur-md" />
          </motion.div>
        ))}
      </div>
    </motion.div>
  </VisualWrapper>
);

// --- 4. Multi-Role Platform ---
// Abstract nodes connecting with animated paths, representing a network.
export const MultiRoleVisual = () => {
  const nodes = [{ x: 0, y: -50 }, { x: -60, y: 50 }, { x: 60, y: 50 }];
  return (
    <VisualWrapper>
      <svg width="200" height="200" viewBox="-100 -100 200 200">
        <defs>
          <motion.linearGradient id="gradient" gradientTransform="rotate(90)">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="100%" stopColor="hsl(var(--primary) / 0.3)" />
          </motion.linearGradient>
        </defs>
        {/* Animated connecting lines */}
        {[
          [nodes[0], nodes[1]],
          [nodes[0], nodes[2]],
        ].map((line, i) => (
          <motion.path
            key={i}
            d={`M ${line[0].x} ${line[0].y} L ${line[1].x} ${line[1].y}`}
            stroke="url(#gradient)"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: i * 0.2, ease: "easeOut" }}
          />
        ))}
        {/* Nodes */}
        {nodes.map((node, i) => (
          <motion.g key={i} transform={`translate(${node.x}, ${node.y})`}>
            <motion.circle
              r="12"
              fill="hsl(var(--card))"
              stroke="hsl(var(--primary))"
              strokeWidth="2"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.5 + i * 0.1 }}
            />
          </motion.g>
        ))}
      </svg>
    </VisualWrapper>
  );
};

// --- 5. Modern & Scalable ---
// An expanding 3D grid, representing an infinite, scalable foundation.
export const ScalableVisual = () => (
  <VisualWrapper>
    <motion.div
      className="grid h-40 w-40 grid-cols-4 grid-rows-4 gap-2"
      style={{ transform: "rotateX(60deg)" }}
      variants={{
        animate: { transition: { staggerChildren: 0.05 } },
      }}
      initial="initial"
      animate="animate"
    >
      {[...Array(16)].map((_, i) => (
        <motion.div
          key={i}
          className="rounded-full bg-primary"
          variants={{
            initial: { opacity: 0, scale: 0 },
            animate: {
              opacity: [0, 1, 0.5, 1],
              scale: [0, 1, 0.8, 1],
              transition: {
                duration: 1.5,
                repeat: Infinity,
                repeatDelay: 3,
                delay: i * 0.05,
              },
            },
          }}
        />
      ))}
    </motion.div>
  </VisualWrapper>
);
