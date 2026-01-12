"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, useMotionValue, useTransform, AnimatePresence, Variants } from "framer-motion";
import { Wrapper } from "@/components/ui/wrapper";
import { STEPS } from "@/lib/steps"; // Assuming STEPS data is still valid

const cardVariants: Variants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: "easeOut" } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2, ease: "easeIn" } },
};

export default function HowItWorksSection() {
  const [active, setActive] = useState(0);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-50, 50], [10, -10]);
  const rotateY = useTransform(x, [-50, 50], [-10, 10]);

  const sectionRef = useRef<HTMLElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const anchorRefs = useRef<(HTMLDivElement | null)[]>([]);
  const announcerRef = useRef<HTMLDivElement | null>(null);
  const scrollTimeout = useRef<number | null>(null);
  const touchStartX = useRef<number | null>(null);

  const goTo = useCallback((index: number) => {
    const clampedIndex = Math.max(0, Math.min(index, STEPS.length - 1));
    setActive(clampedIndex);

    if (scrollTimeout.current) {
      window.clearTimeout(scrollTimeout.current);
    }

    anchorRefs.current[clampedIndex]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    scrollTimeout.current = window.setTimeout(() => {
      scrollTimeout.current = null;
    }, 800);
  }, []);

  // --- All hooks for navigation, scroll-spy, etc. remain the same ---
  // (No changes needed for the useEffect hooks)
  useEffect(() => {
    const onScroll = () => {
      if (scrollTimeout.current) return;
      const stickyTop = cardRef.current?.getBoundingClientRect().top ?? 0;
      let bestIdx = 0;
      let minDistance = Infinity;
      anchorRefs.current.forEach((el, idx) => {
        if (!el) return;
        const dist = Math.abs(el.getBoundingClientRect().top - stickyTop);
        if (dist < minDistance) {
          minDistance = dist;
          bestIdx = idx;
        }
      });
      setActive(bestIdx);
    };
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll();
      } else {
        window.removeEventListener("scroll", onScroll);
      }
    }, { rootMargin: "-100px 0px -100px 0px" });
    const currentSectionRef = sectionRef.current;
    if (currentSectionRef) observer.observe(currentSectionRef);
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (currentSectionRef) observer.unobserve(currentSectionRef);
    };
  }, []);

  useEffect(() => {
    const handleKeyNav = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goTo(active + 1);
      if (e.key === "ArrowLeft") goTo(active - 1);
    };
    const onTouchStart = (e: TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
    const onTouchEnd = (e: TouchEvent) => {
      if (touchStartX.current === null) return;
      const endX = e.changedTouches[0].clientX;
      const diff = endX - touchStartX.current;
      if (diff < -40) goTo(active + 1);
      else if (diff > 40) goTo(active - 1);
      touchStartX.current = null;
    };
    window.addEventListener("keydown", handleKeyNav);
    const sectionNode = sectionRef.current;
    sectionNode?.addEventListener("touchstart", onTouchStart, { passive: true });
    sectionNode?.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("keydown", handleKeyNav);
      sectionNode?.removeEventListener("touchstart", onTouchStart);
      sectionNode?.removeEventListener("touchend", onTouchEnd);
    };
  }, [active, goTo]);

  useEffect(() => {
    if (announcerRef.current) {
      const s = STEPS[active];
      announcerRef.current.textContent = `Step ${active + 1}: ${s.title}. ${s.description}`;
    }
  }, [active]);

  const activeStep = STEPS[active];

  return (
    <section id="how-it-works" ref={sectionRef} aria-labelledby="howitworks-heading" className="py-20 bg-linear-to-b from-background to-background/20">
      <Wrapper>
        <div className="mx-auto max-w-6xl text-center">
          <h2 id="howitworks-heading" className="text-3xl sm:text-4xl font-extrabold text-foreground">
            How Brainy Works — in 3 simple steps
          </h2>
          <p className="mt-3 text-lg text-muted-foreground">
            A compact, trustworthy flow from signup → verification → smarter learning.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 items-start lg:grid-cols-12">
          <div className="sticky top-28 self-start lg:col-span-4">
            <nav aria-label="How Brainy steps" className="space-y-6">
              {STEPS.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => goTo(idx)}
                  className={`group flex w-full items-center gap-4 rounded-xl p-3 transition-all focus:outline-none focus:ring-2 focus:ring-ring ${
                    idx === active ? "bg-primary/10 ring-1 ring-primary/20" : "hover:bg-muted"
                  }`}
                  aria-current={idx === active ? "step" : undefined}
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-medium ${
                      idx === active ? "bg-primary text-primary-foreground" : "bg-card text-foreground border"
                    }`}
                    aria-hidden
                  >
                    {s.id}
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-semibold text-foreground">{s.short}</div>
                    <div className="text-xs text-muted-foreground">{s.title}</div>
                  </div>
                </button>
              ))}
            </nav>
            <div className="mt-6">
              <div className="h-2 w-full rounded-full bg-secondary">
                <motion.div
                  className="h-2 rounded-full bg-primary"
                  animate={{ width: `${((active + 1) / STEPS.length) * 100}%` }}
                  transition={{ duration: 0.45, ease: "easeInOut" }}
                />
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                Step {active + 1} of {STEPS.length}
              </div>
            </div>
            <div className="mt-6 text-sm">
              <a href="/register" className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-primary-foreground shadow hover:scale-[1.02] transition-transform">
                Get Started
              </a>
            </div>
          </div>

          <div className="relative lg:col-span-8">
            <div className="sticky top-28 z-20">
              <motion.div
                ref={cardRef}
                onPointerMove={(e) => {
                  const rect = cardRef.current?.getBoundingClientRect();
                  if (!rect) return;
                  x.set(((e.clientX - rect.left) / rect.width - 0.5) * 100);
                  y.set(((e.clientY - rect.top) / rect.height - 0.5) * 100);
                }}
                onPointerLeave={() => { x.set(0); y.set(0); }}
                style={{ rotateX, rotateY, perspective: 1000 }}
                className="mx-auto w-full max-w-3xl overflow-hidden rounded-3xl bg-linear-to-br from-card to-muted p-6 shadow-2xl"
                role="region"
                aria-roledescription="interactive step card"
                aria-label={`Step ${active + 1} — ${activeStep.title}`}
              >
                <AnimatePresence mode="wait">
                  <motion.div key={active} variants={cardVariants} initial="initial" animate="animate" exit="exit">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                      <div>
                        <h3 tabIndex={-1} className="text-lg font-semibold text-foreground outline-none">
                          {activeStep.title}
                        </h3>
                        <p className="mt-2 text-sm text-muted-foreground">{activeStep.description}</p>

                        {activeStep.bullets?.length && (
                          <ul className="mt-4 space-y-2 text-sm">
                            {activeStep.bullets.map((b, i) => (
                              <li key={i} className="flex items-start gap-2 text-muted-foreground">
                                <span className="mt-1 inline-block h-2 w-2 rounded-full bg-primary" aria-hidden />
                                <span>{b}</span>
                              </li>
                            ))}
                          </ul>
                        )}

                        <div className="mt-6">
                          <a href="/signup" className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-primary-foreground shadow hover:scale-[1.02] transition-transform">
                            Join Now
                          </a>
                        </div>
                      </div>

                      <div className="rounded-lg overflow-hidden h-48 md:h-full">
                        {activeStep.image ? (
                          <div className="relative h-full w-full">
                            <Image src={activeStep.image} alt={activeStep.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 40vw" />
                          </div>
                        ) : (
                          // --- UPDATED: Placeholder uses theme variables ---
                          <div className="flex h-full items-center justify-center bg-secondary text-muted-foreground">No media</div>
                        )}
                      </div>
                    </div>

                    <div className="mt-6 border-t border-border pt-4 text-xs text-muted-foreground flex items-center justify-between">
                      <div>Secure • Verified • Institution-ready</div>
                      <div>Estimated time: 2 minutes</div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            </div>

            <div className="mt-8">
              {STEPS.map((s, idx) => (
                <div
                  key={s.id}
                  ref={(el) => { anchorRefs.current[idx] = el; }}
                  style={{ minHeight: "70vh", scrollMarginTop: "112px", opacity: 0, pointerEvents: "none" }}
                />
              ))}
            </div>

            <div className="mt-6 flex items-center justify-center gap-2 lg:hidden">
              {STEPS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={`h-2 w-8 rounded-full transition-all ${i === active ? "bg-primary" : "bg-secondary"}`}
                  aria-label={`Go to step ${i + 1}`}
                />
              ))}
            </div>

            <div className="sr-only" aria-live="polite" ref={announcerRef} />
          </div>
        </div>
      </Wrapper>
    </section>
  );
}
