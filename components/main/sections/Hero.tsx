"use client";

import Link from "next/link";
import { motion, Variants } from "framer-motion";
import {
  ArrowRight,
  GraduationCap,
  Star,
  Building2,
  ShieldCheck,
} from "lucide-react";

// UI Components
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import QuizPreviewCard from "../../mockup/QuizVisualMockup";
import { Wrapper } from "@/components/ui/wrapper";

const HeroSection = () => {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const cardVariants: Variants = {
    hidden: { scale: 0.9, opacity: 0, rotate: -4 },
    visible: {
      scale: 1,
      opacity: 1,
      rotate: 2,
      transition: { duration: 0.6, ease: [0.25, 1, 0.5, 1] },
    },
  };

  return (
    <section
      id="hero"
      className="relative w-full overflow-hidden bg-background py-24 sm:py-32"
    >
      {/* Background Effects */}
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-secondary/10" />
        <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-primary/10 blur-3xl animate-blob" />
        <div className="animation-delay-4000 absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-accent/10 blur-3xl animate-blob" />
      </div>

      <Wrapper>
        <motion.div
          className="grid grid-cols-1 items-center gap-y-16 lg:grid-cols-2 lg:gap-x-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* LEFT CONTENT */}
          <motion.div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <motion.div variants={itemVariants}>
              <Badge className="gap-2 border-primary/30 bg-primary/10 px-4 py-2 text-primary">
                <ShieldCheck className="h-4 w-4" />
                Verified University Quiz Platform
              </Badge>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
            >
              Smarter Assessments for
              <span className="block text-primary">
                Modern Universities
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="mt-6 max-w-xl text-lg text-muted-foreground"
            >
              Brainy is a secure, institution-ready assessment platform built
              for universities, tutors, and students. Create standardized
              course quizzes, track performance in real time, and ensure
              verified academic integrity — all in one system.
            </motion.p>

            {/* CTA */}
            <motion.div
              variants={itemVariants}
              className="mt-10 flex flex-col gap-4 sm:flex-row"
            >
              <Button
                size="lg"
                className="h-12 px-8 text-base shadow-lg shadow-primary/20 hover:scale-105"
                asChild
              >
                <Link href="/signup">
                  Get Started as a Student
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="h-12 px-8 text-base"
                asChild
              >
                <Link href="/institution/register">
                  Register an Institution
                  <Building2 className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </motion.div>

            {/* SOCIAL PROOF */}
            <motion.div
              variants={itemVariants}
              className="mt-12 flex flex-col items-center gap-4 sm:flex-row"
            >
              <div className="flex -space-x-2">
                {["/img/user1.png", "/img/user2.png", "/img/user3.png"].map(
                  (src, i) => (
                    <Avatar key={i} className="border-2 border-background">
                      <AvatarImage src={src} />
                      <AvatarFallback>U{i + 1}</AvatarFallback>
                    </Avatar>
                  )
                )}
              </div>

              <div className="text-sm text-muted-foreground">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-chart-3 text-chart-3"
                    />
                  ))}
                  <span className="ml-2 font-semibold text-foreground">
                    4.9 / 5
                  </span>
                </div>
                Trusted by students & institutions
              </div>
            </motion.div>
          </motion.div>

          {/* RIGHT VISUAL */}
          <motion.div
            variants={cardVariants}
            className="flex items-center justify-center lg:pl-12"
            style={{ perspective: "1000px" }}
          >
            <div className="transition-transform duration-300 hover:scale-105">
              <QuizPreviewCard />
            </div>
          </motion.div>
        </motion.div>
      </Wrapper>
    </section>
  );
};

export default HeroSection;
