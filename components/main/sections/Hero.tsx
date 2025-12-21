"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, GraduationCap, Star } from "lucide-react";

// Shadcn UI Components
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import QuizPreviewCard from "../QuizPreviewCard";
import { Wrapper } from "@/components/ui/wrapper";

const HeroSection = () => {
  // Animation variants for Framer Motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const cardVariants = {
    hidden: { scale: 0.9, opacity: 0, rotate: -5 },
    visible: {
      scale: 1,
      opacity: 1,
      rotate: 3, // A slight, stylish rotation
      transition: { duration: 0.6, ease: [0.25, 1, 0.5, 1] }, // A smoother ease
    },
  };

  return (
    <section
      id="hero"
      className="relative w-full overflow-hidden bg-background py-24 sm:py-32"
    >
      {/* Animated Gradient Background */}
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-secondary/10" />
        <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-primary/10 opacity-50 blur-3xl filter animate-blob" />{" "}
        <div className="animation-delay-4000 absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-accent/10 opacity-50 blur-3xl filter animate-blob" />{" "}
      </div>

      <Wrapper>
        <motion.div
          className="grid grid-cols-1 items-center gap-y-16 lg:grid-cols-2 lg:gap-x-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* === Left Column: Content === */}
          <motion.div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <motion.div variants={itemVariants}>
              <Badge
                variant="outline"
                className="border-primary/30 bg-primary/10 py-2 px-4 text-primary"
              >
                <GraduationCap className="mr-2 h-4 w-4" />
                University Assessment Platform
              </Badge>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="mt-6 text-4xl font-bold tracking-tighter text-foreground sm:text-5xl lg:text-6xl"
            >
              Master Your Courses with Smart Quizzes
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="mt-6 max-w-xl text-lg text-muted-foreground"
            >
              Brainy transforms university learning through intelligent
              assessments, real-time analytics, and personalized feedback. Built
              for students and tutors who demand excellence.
            </motion.p>

            <motion.div variants={itemVariants} className="mt-10">
              <Button
                size="lg"
                className="h-12 px-8 text-base shadow-lg shadow-primary/20 transition-transform hover:scale-105"
                asChild
              >
                <Link href="/signup">
                  Start Learning for Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="mt-12 flex flex-col items-center gap-4 sm:flex-row"
            >
              <div className="flex -space-x-2">
                {[
                  "/img/user1.png",
                  "/img/user2.png",
                  "/img/user3.png",
                  "/img/user4.png",
                ].map((src, i) => (
                  <Avatar key={i} className="border-2 border-background">
                    <AvatarImage src={src} alt={`User ${i + 1}`} />
                    <AvatarFallback>{`U${i + 1}`}</AvatarFallback>
                  </Avatar>
                ))}
              </div>
              <div className="flex flex-col items-center text-sm text-muted-foreground sm:items-start">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-chart-3 text-chart-3"
                    />
                  ))}
                  <span className="ml-2 font-semibold text-foreground">
                    4.9/5
                  </span>
                </div>
                <p>From 12,000+ students</p>
              </div>
            </motion.div>
          </motion.div>

          {/* === Right Column: Visual === */}
          <motion.div
            variants={cardVariants}
            className="flex items-center justify-center lg:pl-12"
            style={{ perspective: "1000px" }}
          >
            <div className="transition-transform duration-300 ease-out hover:scale-105">
              <QuizPreviewCard />
            </div>
          </motion.div>
        </motion.div>
      </Wrapper>
    </section>
  );
};

export default HeroSection;
