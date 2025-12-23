"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useTransform,
  AnimatePresence,
  Variants,
} from "framer-motion";
import { Wrapper } from "@/components/ui/wrapper";
import { STEPS } from "@/lib/steps";

const cardVariants: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.36, ease: "easeOut" } },
  exit: { opacity: 0, y: -6, transition: { duration: 0.24, ease: "easeIn" } },
};

export default function HowItWorksSection() {
  const [active, setActive] = useState<number>(0);

  // refs
  const anchorRefs = useRef<(HTMLDivElement | null)[]>([]);
  const announcerRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);

  // flags/timers for programmatic scroll suppression
  const isProgrammaticScroll = useRef<boolean>(false);
  const programmaticTimer = useRef<number | null>(null);

  // compute sticky top (viewport Y) for the card
  const stickyTopRef = useRef<number>(0);

  // tilt values for the single visible card
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-50, 50], [10, -10]);
  const rotateY = useTransform(x, [-50, 50], [-10, 10]);

  // pointer tilt handlers
  const handlePointerMove = (e: React.PointerEvent) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    x.set((px - 0.5) * 100);
    y.set((py - 0.5) * 100);
  };
  const handlePointerLeave = () => {
    x.set(0);
    y.set(0);
  };

  // helper: scroll to anchor (clamped) + mark programmatic scroll
  const goTo = useCallback((index: number) => {
    const clamped = Math.max(0, Math.min(index, STEPS.length - 1));
    // set active immediately so UI reflects user's intent
    setActive(clamped);

    // mark programmatic scroll so the scroll spy ignores intermediate updates
    isProgrammaticScroll.current = true;
    if (programmaticTimer.current) window.clearTimeout(programmaticTimer.current);
    // scroll with start block; anchors use scrollMarginTop so sticky alignment is correct
    anchorRefs.current[clamped]?.scrollIntoView({ behavior: "smooth", block: "start" });

    // allow scroll spy to resume after a short delay (enough for smooth scroll to finish)
    programmaticTimer.current = window.setTimeout(() => {
      isProgrammaticScroll.current = false;
      programmaticTimer.current = null;
    }, 700);
  }, []);

  // keyboard nav (left/right)
  const handleKeyNav = useCallback((e: KeyboardEvent) => {
    if (e.key === "ArrowRight") goTo(active + 1);
    if (e.key === "ArrowLeft") goTo(active - 1);
  }, [active, goTo]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyNav);
    return () => window.removeEventListener("keydown", handleKeyNav);
  }, [handleKeyNav]);

  // update stickyTop on resize and initially
  useEffect(() => {
    const updateStickyTop = () => {
      const rect = cardRef.current?.getBoundingClientRect();
      stickyTopRef.current = rect ? rect.top : Math.round(window.innerHeight * 0.2);
    };
    updateStickyTop();
    window.addEventListener("resize", updateStickyTop);
    return () => window.removeEventListener("resize", updateStickyTop);
  }, []);

  // scroll spy: measure distance from each anchor.top to stickyTop — pick the closest
  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      // ignore while programmatic scroll in progress
      if (isProgrammaticScroll.current) return;

      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const stickyTop = stickyTopRef.current;
        const anchors = anchorRefs.current;
        if (!anchors || !anchors.length) {
          ticking = false;
          return;
        }

        let bestIdx = 0;
        let bestDist = Number.POSITIVE_INFINITY;

        anchors.forEach((el, idx) => {
          if (!el) return;
          const rect = el.getBoundingClientRect();
          // choose anchor whose top is closest to the sticky top point
          const dist = Math.abs(rect.top - stickyTop);
          if (dist < bestDist) {
            bestDist = dist;
            bestIdx = idx;
          }
        });

        setActive((prev) => (prev !== bestIdx ? bestIdx : prev));
        ticking = false;
      });
    };

    // initial check (in case page already scrolled)
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // announce changes for screen readers and focus the title in the sticky card
  useEffect(() => {
    const s = STEPS[active];
    if (announcerRef.current) {
      announcerRef.current.textContent = `Step ${active + 1}: ${s.title}. ${s.description}`;
    }
    const t = setTimeout(() => titleRef.current?.focus(), 120);
    return () => clearTimeout(t);
  }, [active]);

  // touch swipe shortcut (small screens)
  const touchStartX = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const endX = e.changedTouches[0].clientX;
    const start = touchStartX.current;
    if (start == null) return;
    const diff = endX - start;
    const threshold = 40;
    if (diff < -threshold) goTo(active + 1);
    else if (diff > threshold) goTo(active - 1);
    touchStartX.current = null;
  };

  const activeStep = STEPS[active];

  return (
    <section aria-labelledby="howitworks-heading" className="py-20 bg-linear-to-b from-white/60 to-slate-50">
      <Wrapper>
        <div className="mx-auto max-w-6xl text-center">
          <h2 id="howitworks-heading" className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            How Brainy Works — in 3 simple steps
          </h2>
          <p className="mt-3 text-lg text-slate-600">
            A compact, trustworthy flow from signup → verification → smarter learning.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 items-start lg:grid-cols-12">
          {/* LEFT: sticky nav (no arrow UI) */}
          <div className="sticky top-28 self-start lg:col-span-4">
            <nav aria-label="How Brainy steps" className="space-y-6">
              {STEPS.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => goTo(idx)}
                  className={`group flex w-full items-center gap-4 rounded-xl p-3 transition-all focus:outline-none focus:ring-2 focus:ring-primary ${
                    idx === active ? "bg-primary/10 ring-1 ring-primary/20" : "hover:bg-slate-100"
                  }`}
                  aria-current={idx === active ? "step" : undefined}
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-medium ${
                      idx === active ? "bg-primary text-white" : "bg-white text-slate-700 border border-slate-200"
                    }`}
                    aria-hidden
                  >
                    {s.id}
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-semibold text-slate-900">{s.short}</div>
                    <div className="text-xs text-slate-500">{s.title}</div>
                  </div>
                </button>
              ))}
            </nav>

            <div className="mt-6">
              <div className="h-2 w-full rounded-full bg-slate-200">
                <motion.div
                  className="h-2 rounded-full bg-primary"
                  animate={{ width: `${((active + 1) / STEPS.length) * 100}%` }}
                  transition={{ duration: 0.45, ease: "easeInOut" }}
                />
              </div>
              <div className="mt-2 text-xs text-slate-500">
                Step {active + 1} of {STEPS.length}
              </div>
            </div>

            <div className="mt-6 text-sm">
              <a href="/register" className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-white shadow hover:scale-[1.02] transition-transform">
                Get Started
              </a>
            </div>
          </div>

          {/* RIGHT: sticky single card + invisible anchors that create scroll space */}
          <div className="relative lg:col-span-8" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
            {/* The single visible sticky card */}
            <div className="sticky top-28 z-20">
              <motion.div
                ref={cardRef}
                onPointerMove={handlePointerMove}
                onPointerLeave={handlePointerLeave}
                style={{ rotateX, rotateY, perspective: 1000 }}
                className="mx-auto w-full max-w-3xl overflow-hidden rounded-3xl bg-linear-to-br from-white to-slate-50 p-6 shadow-2xl"
                role="region"
                aria-roledescription="interactive step card"
                aria-label={`Step ${active + 1} — ${activeStep.title}`}
              >
                <AnimatePresence mode="wait">
                  <motion.div key={active} variants={cardVariants} initial="initial" animate="animate" exit="exit">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                      <div>
                        <h3 ref={titleRef} tabIndex={-1} className="text-lg font-semibold text-slate-900 outline-none">
                          {activeStep.title}
                        </h3>
                        <p className="mt-2 text-sm text-slate-600">{activeStep.description}</p>

                        {activeStep.bullets?.length && (
                          <ul className="mt-4 space-y-2 text-sm">
                            {activeStep.bullets.map((b, i) => (
                              <li key={i} className="flex items-start gap-2 text-slate-600">
                                <span className="mt-1 inline-block h-2 w-2 rounded-full bg-primary" aria-hidden />
                                <span>{b}</span>
                              </li>
                            ))}
                          </ul>
                        )}

                        <div className="mt-6">
                          <a href="/signup" className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-white shadow hover:scale-[1.02] transition-transform">
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
                          <div className="flex h-full items-center justify-center bg-slate-100 text-slate-400">No media</div>
                        )}
                      </div>
                    </div>

                    <div className="mt-6 border-t border-slate-100 pt-4 text-xs text-slate-500 flex items-center justify-between">
                      <div>Secure • Verified • Institution-ready</div>
                      <div>Estimated time: 2 minutes</div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            </div>

            {/* Invisible anchors that create scroll space.
                Important: scrollMarginTop makes scrollIntoView line up the anchor with the sticky card top. */}
            <div className="mt-8">
              {STEPS.map((s, idx) => (
                <div
                  key={s.id}
                  data-step-index={idx}
                  ref={(el) => { anchorRefs.current[idx] = el; }}
                  // match `top-28` (tailwind) => 7rem = 112px. Adjust if you change sticky offset.
                  style={{ minHeight: "70vh", scrollMarginTop: "112px", opacity: 0, pointerEvents: "none" }}
                />
              ))}
            </div>

            <div className="mt-6 flex items-center justify-center gap-2 lg:hidden">
              {STEPS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={`h-2 w-8 rounded-full transition-all ${i === active ? "bg-primary" : "bg-slate-200"}`}
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
