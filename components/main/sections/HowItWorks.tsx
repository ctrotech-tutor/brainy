"use client";

import { Wrapper } from "@/components/ui/wrapper";
import { Brain, Trophy, UserPlus, ArrowRight } from "lucide-react";
import Link from "next/link";

// Data for the three steps
const steps = [
  {
    step: 1,
    title: "Create an Account & Choose Your Course",
    description:
      "Sign up in seconds, set up your profile, and select your university courses like CSC 101, GNS 101, and more to personalize your quiz experience.",
    icon: UserPlus,
  },
  {
    step: 2,
    title: "Take Smart, Timed Quizzes",
    description:
      "Attempt AI-powered quizzes designed to match your course syllabus, difficulty level, and exam standards, with real-time feedback as you progress.",
    icon: Brain,
  },
  {
    step: 3,
    title: "Track Progress & Compete",
    description:
      "View detailed performance insights, earn achievements, climb leaderboards, and improve continuously with every quiz attempt.",
    icon: Trophy,
  },
];

const HowItWorksSection = () => {
  return (
    <section id="howitworks" className="bg-secondary/50 py-20 sm:py-28">
      <Wrapper>
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tighter text-foreground sm:text-4xl">
            Get Started in Three Simple Steps
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            From creation to analysis, our process is designed to be intuitive and
            efficient.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="relative mt-16">
          <div
            aria-hidden="true"
            className="absolute inset-0 top-8 hidden h-px w-full bg-border/50 md:block"
          />

          <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
            {steps.map((step) => (
              <div
                key={step.step}
                className="relative flex flex-col items-center text-center md:items-start md:text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="z-10 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                    {step.step}
                  </div>
                  <step.icon className="hidden h-10 w-10 text-primary md:block" />
                </div>

                {step.step !== 3 && (
                  <div
                    aria-hidden="true"
                    className="absolute left-8 top-16 h-full w-px bg-border/50 md:hidden"
                  />
                )}

                <h3 className="mt-6 text-xl font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-2 text-muted-foreground">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <div className="mt-16 flex justify-center">
          <Link
            href="/signup"
            className="group inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-base font-semibold text-primary-foreground shadow-lg transition-all hover:scale-105 hover:bg-primary/90"
          >
            Start Your Journey
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </Wrapper>
    </section>
  );
};

export default HowItWorksSection;
