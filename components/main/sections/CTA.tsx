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
    <section>
      <Wrapper>
        <div className="relative my-20 overflow-hidden rounded-2xl bg-primary/90 p-8">
          {/* Animated Aurora Background */}
          <div className="absolute inset-0 z-0">
            <div className="aurora-bg"></div>
          </div>
          
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            variants={containerVariants}
            className="relative z-10 mx-auto max-w-2xl text-center"
          >
            <motion.h2
              variants={itemVariants}
              className="text-3xl font-bold tracking-tighter text-primary-foreground sm:text-4xl"
            >
              Ready to Excel in Your Studies?
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="mt-4 text-lg text-primary-foreground/80"
            >
              Join thousands of university students already improving their grades with Brainy.
            </motion.p>
            <motion.div variants={itemVariants} className="mt-8">
              <Button
                size="lg"
                variant="secondary" // Use secondary to pop against the primary background
                className="h-14 px-8 text-lg font-bold shadow-lg transition-transform hover:scale-105"
                asChild
              >
                <Link href="/signup">
                  <Sparkle className="mr-2 h-5 w-5" />
                  Get Started for Free
                  <ArrowRight className="ml-2 h-5 w-5" />
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
