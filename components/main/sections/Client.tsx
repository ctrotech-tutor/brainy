"use client";

import Image from "next/image";
import { Wrapper } from "@/components/ui/wrapper";
import { motion } from "framer-motion";

export const universityLogos = [
  {
    name: "Lagos State University",
    logoLight: "/logos/lasuu.png",
    logoDark: "/logos/lasuu-dark.png",
  },
  {
    name: "University of Lagos",
    logoLight: "/logos/unilagg.png",
    logoDark: "/logos/unilagg-dark.png",
  },
  {
    name: "University of Ibadan",
    logoLight: "/logos/uii.jpeg",
    logoDark: "/logos/uii-dark.png",
  },
  {
    name: "Obafemi Awolowo University",
    logoLight: "/logos/oaulogo.jpg",
    logoDark: "/logos/oaulogo-dark.png",
  },
  {
    name: "University of Nigeria, Nsukka",
    logoLight: "/logos/unn.webp",
    logoDark: "/logos/unn-dark.png",
  },
  {
    name: "Covenant University",
    logoLight: "/logos/covenant.png",
    logoDark: "/logos/covenant-dark.png",
  },
  {
    name: "University of Benin",
    logoLight: "/logos/uniben.png",
    logoDark: "/logos/uniben-dark.png",
  },
  {
    name: "Babcock University",
    logoLight: "/logos/babcock.png",
    logoDark: "/logos/babcock-dark.png",
  },
];

const LogoMarquee = ({ logos, direction = "left", speed = 40 }: { logos: typeof universityLogos, direction?: "left" | "right", speed?: number }) => {
  return (
    <div className="flex overflow-hidden select-none gap-10 group mt-10">
      <motion.div
        animate={{
          x: direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"],
        }}
        transition={{
          duration: speed,
          ease: "linear",
          repeat: Infinity,
        }}
        className="flex flex-nowrap gap-10 min-w-full items-center"
      >
        {[...logos, ...logos].map((uni, idx) => (
          <div
            key={`${uni.name}-${idx}`}
            className="flex-shrink-0 relative h-12 w-48 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-500 hover:scale-110"
          >
            <Image
              src={uni.logoLight}
              alt={uni.name}
              fill
              className="object-contain dark:hidden"
            />
            <Image
              src={uni.logoDark || uni.logoLight}
              alt={uni.name}
              fill
              className="object-contain hidden dark:block"
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
};

const ClientSection = () => {
  return (
    <section id="clients" className="relative bg-background py-24 sm:py-32 overflow-hidden" aria-labelledby="clients-heading">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-[600px] w-full bg-primary/5 blur-[120px]" />

      <Wrapper>
        <div className="mx-auto max-w-4xl text-center mb-20 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-primary mb-6">
              Institutional Trust
            </h2>
            <h3 id="clients-heading" className="text-4xl sm:text-6xl font-black tracking-tighter text-foreground mb-8 leading-[1.1]">
              Powering the next generation of <span className="prose-italics">Academic Excellence.</span>
            </h3>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Brainy is the standardized OS for course evaluations, research
              verifications, and institutional assessments across leading universities.
            </p>
          </motion.div>
        </div>

        {/* The Infinite Scrolling Marquees with Dual Directions */}
        <div className="relative">
          {/* Top Edge Fade */}
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />

          <LogoMarquee logos={universityLogos} speed={50} direction="left" />
          <LogoMarquee logos={universityLogos.slice().reverse()} speed={60} direction="right" />
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="mt-20 flex flex-wrap justify-center items-center gap-x-12 gap-y-6 px-10"
        >
          <div className="flex flex-col items-center">
            <span className="text-3xl font-black text-foreground">50k+</span>
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Active Students</span>
          </div>
          <div className="h-8 w-px bg-white/5 hidden sm:block" />
          <div className="flex flex-col items-center">
            <span className="text-3xl font-black text-foreground">12+</span>
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Verified Institutions</span>
          </div>
          <div className="h-8 w-px bg-white/5 hidden sm:block" />
          <div className="flex flex-col items-center">
            <span className="text-3xl font-black text-foreground">100%</span>
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Enrollment Security</span>
          </div>
        </motion.div>
      </Wrapper>
    </section>
  );
};

export default ClientSection;
