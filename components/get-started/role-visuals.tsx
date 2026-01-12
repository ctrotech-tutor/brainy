// components/get-started/role-visuals.tsx
"use client";
import { motion, Transition, useMotionValue, useReducedMotion, useTransform, Variants } from "framer-motion";
import { useState } from "react";

// A common wrapper to provide a consistent size and perspective for 3D effects
const VisualWrapper = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{ perspective: "1000px" }}
    className="flex h-40 w-40 items-center justify-center"
  >
    {children}
  </div>
);

// --- 1. Student Visual ---
// An open book with pages that turn, representing learning and progress.
export const StudentVisual = () => {
  const [isHovered, setIsHovered] = useState(false);

  // Variants for the main book container to handle the open/close tilt
  const bookVariants: Variants = {
    initial: { rotateX: 50, rotateZ: -15, y: 20, scale: 0.95 },
    hover: {
      rotateX: 35,
      rotateZ: -5,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 150, damping: 20 },
    },
  };

  // Variants for the book cover to animate it opening
  const coverVariants: Variants = {
    initial: { rotateY: 0 },
    hover: {
      rotateY: -160,
      transition: { type: "spring", stiffness: 100, damping: 15, delay: 0.1 },
    },
  };

  // Variants for the individual pages to make them flip
  const pageVariants: Variants = {
    initial: { rotateY: 0 },
    hover: {
      rotateY: -150,
    },
  };
  return (
    <VisualWrapper>
      <motion.div
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        variants={bookVariants}
        initial="initial"
        animate={isHovered ? "hover" : "initial"}
        className="relative h-32 w-24 cursor-pointer"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Back Cover & Spine */}
        <div
          className="absolute inset-0 rounded-lg bg-blue-800 shadow-xl"
          style={{ transform: "translateZ(-10px)" }}
        />

        {/* Pages Block */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            variants={pageVariants}
            transition={{
              type: "spring",
              stiffness: 120,
              damping: 18,
              delay: 0.3 + i * 0.05, // Staggered delay for a realistic flip
            }}
            className="absolute inset-y-1 left-0 h-[calc(100%-8px)] w-[calc(100%-4px)] origin-left rounded-r-sm bg-white"
            style={{
              transform: `translateZ(${-8 + i * 1.5}px)`, // Stack pages in 3D space
            }}
          />
        ))}

        {/* Front Cover */}
        <motion.div
          variants={coverVariants}
          className="absolute inset-0 origin-left rounded-lg bg-blue-600"
          style={{
            transformStyle: "preserve-3d",
            backfaceVisibility: "hidden",
          }}
        >
          {/* Cover Detail/Icon */}
          <div className="flex h-full w-full items-center justify-center">
            <svg
              className="h-10 w-10 text-white/80"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
        </motion.div>
      </motion.div>
    </VisualWrapper>
  );
};

// --- 2. Tutor Visual ---
export const TutorVisual = () => {
  const [isHovered, setIsHovered] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const nodes = [0, 1, 2, 3, 4]; // Increased to 5 nodes for a richer network

  return (
    <VisualWrapper>
      <motion.div
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className="relative h-40 w-40 cursor-pointer"
      >
        <svg
          width="160"
          height="160"
          viewBox="-80 -80 160 160"
          style={{ transform: "rotate(-90deg)" }} // Start with a node at the top
        >
          <defs>
            {/* Gradient for the connecting lines */}
            <linearGradient
              id="tutor-line-gradient"
              x1="0"
              y1="0"
              x2="1"
              y2="0"
            >
              <stop offset="0%" stopColor="hsl(var(--primary) / 0)" />
              <stop offset="100%" stopColor="hsl(var(--primary))" />
            </linearGradient>
          </defs>

          {/* Orbiting/Connecting Nodes */}
          {nodes.map((i) => {
            const angle = (i * 360) / nodes.length;
            const x = Math.cos((angle * Math.PI) / 180) * 60;
            const y = Math.sin((angle * Math.PI) / 180) * 60;

            return (
              <g key={i}>
                {/* Connection Line */}
                <motion.line
                  x1="0"
                  y1="0"
                  x2={x}
                  y2={y}
                  stroke="url(#tutor-line-gradient)"
                  strokeWidth="1.5"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{
                    pathLength: isHovered ? 1 : 0.5,
                    opacity: isHovered ? 1 : 0.5,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 100,
                    damping: 20,
                    delay: 0.1 + i * 0.05,
                  }}
                />
                {/* Outer Node */}
                <motion.circle
                  cx={x}
                  cy={y}
                  r={isHovered ? 8 : 6}
                  fill="hsl(var(--primary))"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 15,
                    delay: 0.2 + i * 0.05,
                  }}
                />
              </g>
            );
          })}

          {/* Central Node with a pulsing effect */}
          <g>
            {/* Outer pulse */}
            <motion.circle
              r="20"
              fill="hsl(var(--primary))"
              animate={{
                scale: shouldReduceMotion ? 1 : [1, 1.2, 1],
                opacity: shouldReduceMotion ? 0.2 : [0.3, 0, 0.3],
              }}
              transition={{
                duration: 2.5,
                ease: "easeInOut",
                repeat: Infinity,
                repeatDelay: 1,
              }}
            />
            {/* Inner core */}
            <motion.circle
              r={isHovered ? 24 : 20}
              fill="hsl(var(--primary))"
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            />
          </g>
        </svg>
      </motion.div>
    </VisualWrapper>
  );
};

// --- 3. Institution Visual ---
export const InstitutionVisual = () => {
  // For interactive 3D rotation on hover
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-50, 50], [10, -10]); // Invert for natural mouse movement
  const rotateY = useTransform(x, [-50, 50], [-10, 10]);

  const handleMouseMove = (event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(event.clientX - rect.left - rect.width / 2);
    y.set(event.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const transition: Transition = {
    type: "spring",
    stiffness: 150,
    damping: 20,
    mass: 1,
  };

  return (
    <VisualWrapper>
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative h-32 w-32 cursor-pointer"
      >
        {/* Base Platform */}
        <motion.div
          initial={{ opacity: 0, z: -10, scaleX: 0.8 }}
          animate={{ opacity: 1, z: 0, scaleX: 1 }}
          transition={{ ...transition, duration: 0.4 }}
          className="absolute bottom-0 h-4 w-full rounded-t-sm bg-primary/20 shadow-lg"
          style={{ transform: "translateZ(-16px) translateY(8px)" }}
        />

        {/* Columns (Pillars of the institution) */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "6rem", opacity: 1 }} // h-24
            transition={{ ...transition, delay: 0.3 + i * 0.1 }}
            className="absolute bottom-4 w-3 bg-primary/50"
            style={{
              left: `${5 + i * 29}%`, // Position columns evenly
              transform: "translateZ(14px)",
            }}
          />
        ))}

        {/* Main Back Wall */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...transition, delay: 0.2 }}
          className="absolute bottom-4 h-24 w-full border border-primary/30 bg-primary/10"
        />

        {/* Roof Structure (Pediment) */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...transition, delay: 0.8 }}
          className="absolute -top-4 left-0 w-full"
          style={{ transformStyle: "preserve-3d", transform: "translateZ(7px)" }}
        >
          {/* Roof Base */}
          <div className="h-3 w-full bg-primary/40" />
          {/* Triangular Pediment */}
          <div
            className="absolute -top-5 left-0 border-b-[20px] border-l-[64px] border-r-[64px] border-b-primary/70 border-l-transparent border-r-transparent"
          />
        </motion.div>
      </motion.div>
    </VisualWrapper>
  );
};