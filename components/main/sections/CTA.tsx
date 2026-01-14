"use client";

import { motion, Variants } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkle } from "lucide-react";
import { Wrapper } from "@/components/ui/wrapper";
import { Button } from "@/components/ui/button";

// Animation variants for the container to stagger children
const containerVariants: Variants = {
  visible: {
    transition: {
      staggerChildren: 0.2, // Animate children one after another
    },
  },
};

// Animation for individual text elements
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const CtaSection = () => {
  return (
    <section id="cta" className="relative py-24 sm:py-32 overflow-hidden" aria-labelledby="cta-heading">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(hsl(var(--primary)/0.03)_1px,transparent_1px)] [background-size:24px_24px]" />

      <Wrapper>
        <div className="relative overflow-hidden rounded-[2.5rem] bg-linear-to-br from-primary via-primary/95 to-primary/90 p-8 sm:p-16 shadow-2xl shadow-primary/20 border border-white/10">
          {/* Animated Aurora/Glow Background */}
          <div className="absolute inset-0 z-0 opacity-40">
            <div className="absolute -top-1/2 -left-1/4 h-[200%] w-[150%] animate-slow-spin bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.2)_0,transparent_50%)]" />
            <div className="absolute -bottom-1/2 -right-1/4 h-[200%] w-[150%] animate-reverse-slow-spin bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.1)_0,transparent_50%)]" />
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="relative z-10 mx-auto max-w-3xl text-center"
          >
            <motion.div variants={itemVariants} className="flex justify-center mb-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-sm font-medium text-white backdrop-blur-md border border-white/10">
                <Sparkle className="h-4 w-4" />
                <span>Standardized Academic Integrity</span>
              </div>
            </motion.div>

            <motion.h2
              id="cta-heading"
              variants={itemVariants}
              className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl"
            >
              Ready to Excel in Your <span className="text-white/80">Studies?</span>
            </motion.h2>

            <motion.p
              variants={itemVariants}
              className="mt-6 text-lg text-white/80 md:text-xl max-w-2xl mx-auto leading-relaxed"
            >
              Join thousands of university students and researchers already
              transforming their academic journey with Brainy's secure assessment ecosystem.
            </motion.p>

            <motion.div variants={itemVariants} className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                variant="secondary"
                className="h-14 px-10 text-lg font-bold shadow-xl transition-all hover:scale-105 hover:shadow-2xl active:scale-95"
                asChild
              >
                <Link href="/signup">
                  Get Started for Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="h-14 px-10 text-lg font-semibold text-white border-white/20 bg-white/5 backdrop-blur-md hover:bg-white/10"
                asChild
              >
                <Link href="/about">
                  Learn More
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </Wrapper>
    </section>
  );
};

export default CtaSection;
