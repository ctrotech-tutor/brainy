"use client";

import Image from "next/image"; // Import the Next.js Image component
import { Wrapper } from "@/components/ui/wrapper";

// For the Next.js Image component, it's best to define dimensions.
// These act as a max-width/max-height; the image will scale down responsively.
const LOGO_HEIGHT = 48; // Corresponds to h-12
const LOGO_WIDTH = 180; // An average width to reserve space

const universityLogos = [
  { name: "University of Cambridge", logo: "/logos/cambridge.svg" },
  { name: "Harvard University", logo: "/logos/harvard.svg" },
  { name: "Stanford University", logo: "/logos/stanford.svg" },
  { name: "MIT", logo: "/logos/mit.svg" },
  { name: "University of Oxford", logo: "/logos/oxford.svg" },
  { name: "ETH Zurich", logo: "/logos/eth-zurich.svg" },
  { name: "University of Tokyo", logo: "/logos/tokyo.svg" },
];

const ClientSection = () => {
  return (
    <section id="clients" className="py-20 sm:py-28">
      <Wrapper>
        <div className="text-center">
          <h2 className="text-lg font-semibold uppercase tracking-wider text-primary">
            Trusted by Leading Universities
          </h2>
        </div>
      </Wrapper>

      {/* The Infinite Scrolling Marquee */}
      <div
        className="group relative mt-12 flex gap-12 overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
        }}
      >
        {/* We render the scrolling content twice to create a seamless loop */}
        {[...Array(2)].map((_, index) => (
          <div
            key={index}
            // The 'group-hover' utility pauses the animation on hover for better UX
            className="flex flex-shrink-0 animate-scroll items-center justify-around gap-12 animate-scroll"
          >
            {universityLogos.map((uni) => (
              <div key={uni.name} className="flex-shrink-0 px-4">
                <Image
                  src={uni.logo}
                  alt={`${uni.name} logo`}
                  width={LOGO_WIDTH}
                  height={LOGO_HEIGHT}
                  // The 'h-10' or 'h-12' sets the visual height, while width is 'auto'.
                  // The width/height props on the Image component are for aspect ratio and preventing CLS.
                  className="h-10 w-auto text-muted-foreground opacity-60 transition-opacity duration-300 hover:opacity-100 sm:h-12"
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
};

export default ClientSection;
