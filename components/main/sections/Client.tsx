"use client";

import Image from "next/image";
import { Wrapper } from "@/components/ui/wrapper"; // Assuming a layout wrapper component

// --- ENHANCED DATA STRUCTURE ---
// Includes separate logos for light and dark themes for robust theme handling.
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
  }, // Assumes you create a dark version
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

/**
 * A modern, theme-aware, and infinitely scrolling client logo section.
 * It pauses on hover and respects user's preference for reduced motion.
 */
const ClientSection = () => {
  return (
    <section id="clients" className="bg-background py-20 sm:py-28">
      <Wrapper>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Trusted by Leading Universities
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Designed to support standardized assessments across faculties,
            departments, and institutions.
          </p>
        </div>

        {/* The Infinite Scrolling Marquee */}
        <div
          className="group relative mt-16 flex gap-x-16 overflow-hidden"
          style={{
            maskImage:
              "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
          }}
        >
          {/* We render the scrolling content twice for a seamless loop */}
          {[...Array(2)].map((_, index) => (
            <div
              key={index}
              className="flex shrink-0 animate-scroll items-center justify-around gap-x-16 group-hover:[animation-play-state:paused] motion-reduce:animate-none"
            >
              {universityLogos.map((uni) => (
                <div
                  key={uni.name}
                  className="flex shrink-0 items-center justify-center px-4 py-2"
                >
                  {/* --- THEME-AWARE LOGO RENDERING --- */}
                  <div className="relative h-12 w-40 transition-transform duration-300 ease-in-out hover:scale-110">
                    {/* Light mode logo: Visible by default, hidden in dark mode */}
                    <Image
                      src={uni.logoLight}
                      alt={`${uni.name} logo`}
                      fill
                      sizes="(max-width: 768px) 100vw, 160px"
                      className="object-contain opacity-60 transition-opacity duration-300 hover:opacity-100 dark:hidden"
                    />
                    {/* Dark mode logo: Hidden by default, visible in dark mode */}
                    <Image
                      src={uni.logoDark}
                      alt={`${uni.name} logo`}
                      fill
                      sizes="(max-width: 768px) 100vw, 160px"
                      className="hidden object-contain opacity-60 transition-opacity duration-300 hover:opacity-100 dark:block"
                    />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </Wrapper>
    </section>
  );
};

export default ClientSection;
