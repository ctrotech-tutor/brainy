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
export const InstitutionVisual = () => (
  <VisualWrapper>
    <motion.div
      className="relative h-44 w-44"
      initial="initial"
      animate="animate"
      whileHover="hover"
      style={{ transformStyle: "preserve-3d" }}
    >
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute inset-0 origin-center rounded-3xl border border-white/20 bg-linear-to-br from-primary/40 to-primary/5 backdrop-blur-md shadow-2xl"
          variants={{
            initial: { y: 0, rotateX: 65, rotateZ: 0 },
            animate: {
              y: -i * 30,
              rotateX: 65,
              rotateZ: i * 5,
              scale: 1 - i * 0.08,
              transition: { 
                type: "spring", 
                stiffness: 120, 
                damping: 20, 
                delay: i * 0.1,
                repeat: Infinity,
                repeatType: "mirror",
                duration: 4
              },
            },
            hover: {
              y: -i * 45,
              scale: 1 - i * 0.05,
              transition: { type: "spring", stiffness: 200, damping: 12 },
            },
          }}
        >
          {/* Inner pulse */}
          <div className="absolute inset-2 rounded-2xl bg-white/5 animate-pulse" />
        </motion.div>
      ))}
    </motion.div>
  </VisualWrapper>
);

// --- 2. Secure & Verified ---
export const SecurityVisual = () => (
  <VisualWrapper>
    <motion.div
      className="relative h-44 w-44 flex items-center justify-center"
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* Central Pulsing Shield */}
      <motion.div
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.5, 0.8, 0.5]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute h-32 w-32 rounded-full bg-primary/20 blur-2xl"
      />
      
      <motion.div
        animate={{ rotateY: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        style={{ transformStyle: "preserve-3d" }}
        className="relative"
      >
        {/* Main Rings */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute inset-0 rounded-full border-2 border-primary/30"
            animate={{ rotateX: [0, 360], rotateZ: [0, 360] }}
            transition={{ 
              duration: 10 + i * 5, 
              repeat: Infinity, 
              ease: "linear",
              delay: i * 2 
            }}
          />
        ))}

        {/* Orbiting Elements */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute left-1/2 top-1/2 h-4 w-4 rounded-full bg-primary shadow-[0_0_15px_hsl(var(--primary))]"
            style={{ transformStyle: "preserve-3d" }}
            animate={{
              transform: [
                `translate(-50%, -50%) rotateY(${i * 90}deg) translateZ(80px) rotateY(-${i * 90}deg)`,
                `translate(-50%, -50%) rotateY(${i * 90 + 360}deg) translateZ(80px) rotateY(-${i * 90 + 360}deg)`,
              ],
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          />
        ))}
      </motion.div>
    </motion.div>
  </VisualWrapper>
);

// --- 3. Analytics & Insights ---
export const AnalyticsVisual = () => (
  <VisualWrapper>
    <motion.div
      className="relative h-44 w-56 p-6 rounded-3xl border border-white/10 bg-card/40 backdrop-blur-xl shadow-2xl"
      style={{ 
        transform: "rotateX(30deg) rotateZ(-10deg)",
        transformStyle: "preserve-3d" 
      }}
      initial="initial"
      animate="animate"
    >
      <div className="flex h-full items-end gap-3 px-2">
        {[0.4, 0.9, 0.6, 0.8, 0.5].map((height, i) => (
          <div key={i} className="relative flex-1 group" style={{ transformStyle: "preserve-3d" }}>
            <motion.div
              className="w-full rounded-t-lg bg-linear-to-t from-primary/40 to-primary relative"
              variants={{
                initial: { height: 0, translateZ: 0 },
                animate: {
                  height: `${height * 100}%`,
                  translateZ: 20 + i * 5,
                  transition: { type: "spring", stiffness: 100, damping: 15, delay: i * 0.1 },
                },
              }}
            >
              {/* Floating Value Indicator */}
              <motion.div 
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                className="absolute -top-8 left-0 w-full text-[10px] font-bold text-primary text-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                {Math.floor(height * 100)}%
              </motion.div>
              {/* Beam Effect */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-primary/50 blur-[2px]" />
            </motion.div>
          </div>
        ))}
      </div>
      {/* Base Grid */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(hsl(var(--primary)/0.1)_1px,transparent_1px)] bg-[size:12px_12px] opacity-50" />
    </motion.div>
  </VisualWrapper>
);

// --- 4. Multi-Role Platform ---
export const MultiRoleVisual = () => {
  const nodes = [
    { x: 0, y: -70, label: "Admin" }, 
    { x: -70, y: 50, label: "Tutor" }, 
    { x: 70, y: 50, label: "Student" }
  ];
  return (
    <VisualWrapper>
      <svg width="220" height="220" viewBox="-110 -110 220 220" className="drop-shadow-2xl">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        
        {/* Connection paths with dash animation */}
        {[
          [nodes[0], nodes[1]], [nodes[1], nodes[2]], [nodes[2], nodes[0]]
        ].map((line, i) => (
          <motion.path
            key={`line-${i}`}
            d={`M ${line[0].x} ${line[0].y} L ${line[1].x} ${line[1].y}`}
            stroke="hsl(var(--primary))"
            strokeWidth="2"
            strokeDasharray="4 4"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: 1, 
              opacity: 0.3,
              strokeDashoffset: [0, -20]
            }}
            transition={{ 
              pathLength: { duration: 1.5, delay: i * 0.2 },
              strokeDashoffset: { duration: 1, repeat: Infinity, ease: "linear" }
            }}
          />
        ))}

        {/* Pulsing Core */}
        <motion.circle
          r="40"
          fill="none"
          stroke="hsl(var(--primary)/0.1)"
          strokeWidth="10"
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 3, repeat: Infinity }}
        />

        {/* Node Points */}
        {nodes.map((node, i) => (
          <motion.g key={i} transform={`translate(${node.x}, ${node.y})`}>
            <motion.circle
              r="14"
              fill="hsl(var(--card))"
              stroke="hsl(var(--primary))"
              strokeWidth="2"
              filter="url(#glow)"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.5 + i * 0.1 }}
            />
            <motion.circle
              r="6"
              fill="hsl(var(--primary))"
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
            />
          </motion.g>
        ))}
      </svg>
    </VisualWrapper>
  );
};

// --- 5. Modern & Scalable ---
export const ScalableVisual = () => (
  <VisualWrapper>
    <div className="relative h-44 w-44" style={{ transformStyle: "preserve-3d" }}>
      <motion.div
        className="grid h-full w-full grid-cols-4 gap-2"
        style={{ transform: "rotateX(55deg) rotateZ(45deg)" }}
      >
        {[...Array(16)].map((_, i) => (
          <motion.div
            key={i}
            className="aspect-square rounded-md bg-linear-to-br from-primary to-primary/40 shadow-lg"
            initial={{ translateZ: -100, opacity: 0 }}
            animate={{ 
              translateZ: 0, 
              opacity: 1,
              transition: { 
                type: "spring", 
                delay: (i % 4 + Math.floor(i / 4)) * 0.1 
              }
            }}
            whileHover={{ 
              translateZ: 40,
              backgroundColor: "hsl(var(--primary))",
              transition: { duration: 0.2 }
            }}
          >
            {/* Side faces for 3D cuboid effect */}
            <div className="absolute top-0 left-0 h-full w-1 bg-white/10 origin-left -rotate-y-90" />
            <div className="absolute top-0 right-0 h-1 w-full bg-white/10 origin-top -rotate-x-90" />
          </motion.div>
        ))}
      </motion.div>
      
      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`p-${i}`}
          className="absolute h-1 w-1 rounded-full bg-primary"
          animate={{
            x: [0, (i - 3) * 40],
            y: [0, -100 - i * 20],
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 0.5,
            ease: "easeOut"
          }}
        />
      ))}
    </div>
  </VisualWrapper>
);
