"use client";

import Image from "next/image";
import { motion, Variants } from "framer-motion";
import { cn } from "@/lib/utils";
import { features } from "@/lib/features";
import { Wrapper } from "@/components/ui/wrapper";
import { CheckCircle2 } from "lucide-react";

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
  const featuresCount = features.length;

  return (
    <section id="features" className="bg-background py-20 sm:py-28">
      <Wrapper>
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tighter text-foreground sm:text-4xl md:text-5xl">
            Built for Modern Academic Assessment
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Everything universities, tutors, and students need to create, manage, and take
            standardized course assessments — securely and at scale.
          </p>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={gridContainerVariants}
          className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-4 md:auto-rows-fr"
        >
          {features.map((feature, index) => {
            const isTruncated = index >= featuresCount - 2;

            return (
              <motion.div
                key={feature.title}
                variants={cardVariants}
                layout
                transition={{ layout: { duration: 0.3, ease: "easeOut" } }}
                tabIndex={isTruncated ? 0 : -1}
                className={cn(
                  "group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-card/60 p-6 shadow-lg backdrop-blur-xl transition-shadow duration-300 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-primary",
                  feature.className
                )}
              >
                {feature.image && (
                  <Image
                    src={feature.image}
                    alt={`${feature.title} background`}
                    fill
                    className="object-cover opacity-20 transition-opacity duration-300 group-hover:opacity-30 group-focus-within:opacity-30"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                )}
                
                <div className="relative z-10 flex h-full flex-col">
                  <div className="flex shrink-0 h-14 w-14 items-center justify-center rounded-lg bg-primary/10 mb-4">
                    <feature.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold text-card-foreground mb-2">
                    {feature.title}
                  </h3>
                  
                  <div className="relative">
                    <p
                      className={cn(
                        "text-card-foreground/80 text-sm transition-all duration-300",
                        isTruncated && "line-clamp-3"
                      )}
                    >
                      {feature.description}
                    </p>
                  </div>


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
            );
          })}
        </motion.div>
      </Wrapper>
    </section>
  );
};

export default FeaturesSection;
