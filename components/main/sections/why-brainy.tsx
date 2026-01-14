// components/main/sections/why-brainy-section.tsx
"use client";

import { motion } from "framer-motion";
import { Wrapper } from "@/components/ui/wrapper";
import { whyBrainyReasons } from "@/lib/why-brainy";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const WhyBrainySection = () => {
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { currentTarget, clientX, clientY } = e;
    const { left, top } = currentTarget.getBoundingClientRect();
    const x = clientX - left;
    const y = clientY - top;

    currentTarget.style.setProperty("--mouse-x", `${x}px`);
    currentTarget.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <section id="why-brainy" className="relative bg-background overflow-hidden py-24 sm:py-32" aria-labelledby="why-brainy-heading">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(hsl(var(--primary)/0.03)_1px,transparent_1px)] [background-size:40px_40px]" />
      <div className="absolute top-1/2 left-1/2 -z-10 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[120px]" />

      <Wrapper>
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center mb-16 lg:mb-24">
          <Badge variant="outline" className="mb-4 border-primary/20 bg-primary/5 text-primary px-4 py-1 rounded-full">The Brainy Advantage</Badge>
          <motion.h2
            id="why-brainy-heading"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl"
          >
            Smarter by <span className="text-primary italic">Design.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-6 text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            A complete, modern academic assessment ecosystem built from the
            ground up for institutional scale and uncompromised integrity.
          </motion.p>
        </div>

        {/* Improved Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[minmax(200px,auto)] lg:auto-rows-[180px]">
          {whyBrainyReasons.map((reason, index) => {
            const Visual = reason.visual;

            // Perfectly balanced grid spans for exactly 4 items
            const spans = [
              "md:col-span-8 lg:col-span-7 row-span-2", // Item 1 (Institution)
              "md:col-span-4 lg:col-span-5 row-span-4", // Item 2 (Security) - Tall visual
              "md:col-span-8 lg:col-span-7 row-span-2", // Item 3 (Analytics)
              "md:col-span-12 lg:col-span-12 row-span-2", // Item 4 (Multi-Role) - Bottom wide
            ][index];

            return (
              <motion.div
                key={reason.id}
                onMouseMove={handleMouseMove}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: [0.21, 0.45, 0.32, 0.9] }}
                className={cn(
                  "group relative overflow-hidden rounded-[2.5rem] bg-card/30 border border-white/5 backdrop-blur-md p-8 lg:p-10",
                  "transition-all duration-500 hover:bg-card/50 hover:shadow-2xl hover:shadow-primary/5",
                  spans
                )}
              >
                {/* Visual Background - Integrated & Dynamic */}
                <div className="absolute -right-4 -bottom-4 opacity-15 transition-all duration-700 group-hover:opacity-40 group-hover:scale-110 group-hover:rotate-3 pointer-events-none">
                  <div className="scale-[1.6] lg:scale-[1.8] origin-bottom-right">
                    <Visual />
                  </div>
                </div>

                {/* Spotlight Gradient Effect */}
                <div className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-[radial-gradient(circle_at_var(--mouse-x,50%)_var(--mouse-y,50%),hsl(var(--primary)/0.15)_0%,transparent_50%)]" />

                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div className="space-y-6">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-primary to-primary/80 shadow-xl shadow-primary/20 text-white transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-primary/40">
                      <reason.icon className="h-7 w-7" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold tracking-tight text-foreground lg:text-3xl leading-tight">
                        {reason.title}
                      </h3>
                      <div className="h-1.5 w-8 rounded-full bg-primary/40 mt-3 transition-all duration-500 group-hover:w-16 group-hover:bg-primary" />
                    </div>
                  </div>

                  <p className="mt-8 max-w-[280px] text-muted-foreground/90 leading-relaxed lg:text-lg">
                    {reason.description}
                  </p>
                </div>

                {/* Decorative Premium Border Glow */}
                <div className="absolute inset-0 rounded-[2.5rem] border-2 border-transparent transition-colors duration-500 group-hover:border-primary/20" />
              </motion.div>
            );
          })}
        </div>
      </Wrapper>
    </section >
  );
};

export default WhyBrainySection;
