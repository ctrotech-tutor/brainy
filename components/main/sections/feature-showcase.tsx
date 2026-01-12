// components/sections/feature-showcase-section.tsx
"use client";

import { motion, Variants } from "framer-motion";
import { cn } from "@/lib/utils";
import { Wrapper } from "@/components/ui/wrapper";
import { Badge } from "@/components/ui/badge";

// Props and animation variants remain the same
type Benefit = {
  icon: React.ElementType;
  title: string;
  description: string;
};

type FeatureShowcaseProps = {
  id: string;
  badge: {
    icon: React.ElementType;
    label: string;
  };
  title: string;
  description: string;
  benefits: Benefit[];
  visual: React.ReactNode;
  layout?: "left" | "right";
  className?: string;
  children?: React.ReactNode;
  noPaddingTop?: boolean;
};

const textVariants: Variants = {
  hidden: (direction: number) => ({ opacity: 0, x: direction * 20 }),
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, staggerChildren: 0.1 },
  },
};

const visualVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export const FeatureShowcaseSection = ({
  id,
  badge,
  title,
  description,
  benefits,
  visual,
  layout = "right",
  className,
  children,
  noPaddingTop = false,
}: FeatureShowcaseProps) => {
  const textDirection = layout === "right" ? -1 : 1;

  return (
    <section id={id} className={cn("relative", !noPaddingTop && "py-20 sm:py-28", className)}>
      {children}
      <Wrapper>
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* --- FIX: Swapped the order of the two columns in the JSX --- */}
          {/* This makes "Text on top" the default for mobile screens */}

          {/* === Text Content Column (Now first in the code) === */}
          <motion.div
            className="flex flex-col"
            custom={textDirection}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={textVariants}
          >
            <motion.div variants={textVariants} custom={textDirection}>
              <Badge variant="outline" className="border-primary/30 bg-primary/10 py-2 px-4 text-primary">
                <badge.icon className="mr-2 h-4 w-4" />
                {badge.label}
              </Badge>
            </motion.div>

            <motion.h2
              variants={textVariants}
              custom={textDirection}
              className="mt-6 text-3xl font-bold tracking-tighter text-foreground sm:text-4xl"
            >
              {title}
            </motion.h2>

            <motion.p
              variants={textVariants}
              custom={textDirection}
              className="mt-4 text-lg text-muted-foreground"
            >
              {description}
            </motion.p>

            <div className="mt-8 space-y-6">
              {benefits.map((benefit) => (
                <motion.div
                  key={benefit.title}
                  variants={textVariants}
                  custom={textDirection}
                  className="flex items-start gap-4"
                >
                  <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-background/70">
                    <benefit.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-foreground">
                      {benefit.title}
                    </h4>
                    <p className="mt-1 text-muted-foreground">
                      {benefit.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* === Visual Column (Now second in the code) === */}
          <motion.div
            // --- FIX: Updated the ordering logic ---
            // If layout is 'right' (text-left, visual-right), move the text column to the start on large screens.
            // Otherwise, the visual column will naturally come after the text.
            className={cn(
              "flex items-center justify-center transition-transform duration-300 ease-out hover:scale-105",
              layout === "right" && "lg:order-first"
            )}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            variants={visualVariants}
          >
            {visual}
          </motion.div>
        </div>
      </Wrapper>
    </section>
  );
};
