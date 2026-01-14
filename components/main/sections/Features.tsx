"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { features } from "@/lib/features";
import { Wrapper } from "@/components/ui/wrapper";
import { CheckCircle2, Spotlight, Sparkles } from "lucide-react";
import { useState, useRef } from "react";

const FeatureCard = ({ feature, index }: { feature: any; index: number }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "group relative overflow-hidden rounded-[2.5rem] border border-white/5 bg-card/30 p-8 backdrop-blur-2xl transition-all duration-500 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5",
        feature.className
      )}
    >
      {/* Spotlight Effect */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, hsl(var(--primary)/10%), transparent 40%)`,
        }}
      />

      <div className="relative z-10 flex h-full flex-col">
        {/* Header: Icon & Category */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
            <feature.icon className="h-8 w-8" />
          </div>
          <div className="flex gap-2">
            <div className="h-2 w-2 rounded-full bg-primary/20 group-hover:bg-primary/50 transition-colors" />
            <div className="h-2 w-2 rounded-full bg-primary/10 group-hover:bg-primary/30 transition-colors" />
          </div>
        </div>

        {/* Content */}
        <h3 className="text-2xl font-black tracking-tight text-foreground mb-4 group-hover:text-primary transition-colors">
          {feature.title}
        </h3>
        <p className="text-muted-foreground leading-relaxed mb-8 flex-1">
          {feature.description}
        </p>

        {/* Sub-features/Checklist */}
        {feature.sub && (
          <div className="space-y-3 pt-6 border-t border-white/5 mt-auto">
            {feature.sub.map((item: string) => (
              <div key={item} className="flex items-center gap-3 group/item">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 group-hover/item:scale-110 transition-transform">
                  <CheckCircle2 className="h-3 w-3" />
                </div>
                <span className="text-sm font-medium text-muted-foreground group-hover/item:text-foreground transition-colors">
                  {item}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Decorative Ornaments */}
      <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-primary/5 blur-3xl group-hover:bg-primary/10 transition-colors duration-700" />
    </motion.div>
  );
};

const FeaturesSection = () => {
  return (
    <section id="features" className="relative bg-background py-24 sm:py-32 overflow-hidden" aria-labelledby="features-heading">
      {/* Background patterns */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(hsl(var(--primary)/3%)_1px,transparent_1px)] [background-size:40px_40px] opacity-50" />
      <div className="absolute top-0 right-0 -z-10 h-[800px] w-[800px] rounded-full bg-primary/5 blur-[120px] translate-x-1/2 -translate-y-1/2" />

      <Wrapper>
        <div className="mx-auto max-w-4xl text-center mb-20 px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-card border border-white/5 text-xs font-black tracking-widest uppercase text-primary mb-8 shadow-xl shadow-primary/5">
              <Sparkles className="h-4 w-4" />
              Intelligence at Scale
            </div>
            <h2 id="features-heading" className="text-5xl sm:text-7xl font-black tracking-tighter text-foreground mb-8 leading-[0.9]">
              Engineered for <span className="text-primary prose-italics">Institutional Impact.</span>
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              A comprehensive suite of tools designed to replace legacy evaluation
              systems with secure, data-driven, and AI-assisted workflows.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:grid-cols-4">
          {features.map((feature, idx) => (
            <FeatureCard key={feature.title} feature={feature} index={idx} />
          ))}
        </div>

        {/* Bottom CTA Highlight */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 p-10 rounded-[3rem] bg-secondary/30 border border-white/5 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left"
        >
          <div className="flex items-center gap-6">
            <div className="h-16 w-16 rounded-[1.5rem] bg-primary/10 flex items-center justify-center text-primary">
              <Spotlight className="h-8 w-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">Discover Deep Analytics</h3>
              <p className="text-sm text-muted-foreground">Every assessment provides a granular breakdown of performance trends.</p>
            </div>
          </div>
          <button className="px-8 py-4 rounded-2xl bg-white text-black font-black uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-2xl">
            View Sample Report
          </button>
        </motion.div>
      </Wrapper>
    </section>
  );
};

export default FeaturesSection;
