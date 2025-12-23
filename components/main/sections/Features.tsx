"use client";

import Image from "next/image"; // Step 1: Import the Image component
import { motion, Variants } from "framer-motion";
import { cn } from "@/lib/utils";
import { features } from "@/lib/features";
import { Wrapper } from "@/components/ui/wrapper";
import { CheckCircle2 } from "lucide-react";

// Animation variants (no changes here)
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const gridContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const FeaturesSection = () => {
  return (
    <section id="features" className="bg-background py-20 sm:py-28">
      <Wrapper>
        {/* Section Header (no changes here) */}
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tighter text-foreground sm:text-4xl md:text-5xl">
            Built for Modern Academic Assessment
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Everything universities, tutors, and students need to create, manage, and take
            standardized course assessments — securely and at scale.
          </p>
        </div>

        {/* Bento Grid Layout (no changes here) */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={gridContainerVariants}
          className="mt-16 grid auto-rows-[280px] grid-cols-1 gap-6 md:grid-cols-4"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={cardVariants}
              className={cn(
                "group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-card/60 p-6 shadow-lg backdrop-blur-xl transition-shadow duration-300 hover:shadow-2xl",
                feature.className
              )}
            >
              {/* Step 2: Replace <img> with next/image's Image component */}
              {feature.image && (
                <Image
                  src={feature.image}
                  alt={`${feature.title} background`}
                  fill // Use `fill` to make it cover the parent container
                  className="object-cover opacity-20 transition-opacity duration-300 group-hover:opacity-30"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Helps Next.js pick the right image size
                />
              )}
              
              {/* Card Content (no changes here) */}
              <div className="relative z-10 flex h-full flex-col">
                <div className="flex shrink-0 h-14 w-14 items-center justify-center rounded-lg bg-primary/10 mb-4">
                  <feature.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-card-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-card-foreground/80 text-sm">
                  {feature.description}
                </p>
                {feature.sub && (
                  <ul className="mt-auto space-y-2 pt-4">
                    {feature.sub.map((subItem) => (
                      <li key={subItem} className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-green-500" />
                        <span className="text-sm text-muted-foreground">
                          {subItem}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </Wrapper>
    </section>
  );
};

export default FeaturesSection;
