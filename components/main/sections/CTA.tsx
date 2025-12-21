"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkle } from "lucide-react";
import { Wrapper } from "@/components/ui/wrapper";
import { Button } from "@/components/ui/button";

const CtaSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  // This effect handles the interactive spotlight
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      sectionRef.current.style.setProperty("--mouse-x", `${x}px`);
      sectionRef.current.style.setProperty("--mouse-y", `${y}px`);
    };

    const currentRef = sectionRef.current;
    currentRef?.addEventListener("mousemove", handleMouseMove);

    return () => {
      currentRef?.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <section>
      <Wrapper>
        <div
          ref={sectionRef}
          className="relative my-20 overflow-hidden rounded-2xl bg-secondary p-8"
          // This style applies the spotlight effect using CSS variables
          style={
            {
              "--spotlight-color": "hsl(var(--primary) / 0.15)",
              backgroundImage: `radial-gradient(circle at var(--mouse-x) var(--mouse-y), var(--spotlight-color) 0%, transparent 40%)`,
            } as React.CSSProperties
          }
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative z-10 mx-auto max-w-2xl text-center"
          >
            <h2 className="text-3xl font-bold tracking-tighter text-foreground sm:text-4xl">
              Ready to Excel in Your Studies?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Join thousands of university students already improving their grades with Brainy
            </p>
            <div className="mt-8">
              <Button
                size="lg"
                className="h-14 px-8 text-lg font-bold shadow-lg shadow-primary/20 transition-transform hover:scale-105"
                asChild
              >
                <Link href="/signup">
                  <Sparkle className="mr-2 h-5 w-5" />
                  Get Started for Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </Wrapper>
    </section>
  );
};

export default CtaSection;
