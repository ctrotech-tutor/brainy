"use client";

import { motion, Variants } from "framer-motion";
import { User, TrendingUp, Target, Award } from "lucide-react";
import { Wrapper } from "@/components/ui/wrapper";
import { Badge } from "@/components/ui/badge";
import DashboardPreviewCard from "../../mockup/StudentDashboardVisual";

// Data for the benefit list
const studentBenefits = [
  {
    icon: TrendingUp,
    title: "Performance Tracking",
    description:
      "Monitor your progress across all courses with detailed analytics and insights.",
  },
  {
    icon: Target,
    title: "Targeted Practice",
    description: "Focus on weak areas with personalized quiz recommendations.",
  },
  {
    icon: Award,
    title: "Compete & Excel",
    description:
      "Challenge classmates and climb leaderboards to stay motivated.",
  },
];

const ForStudentsSection = () => {
  const textVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, staggerChildren: 0.1 },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <section id="for-students" className="bg-background py-20 sm:py-28 select-none">

      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-secondary/10" />
        <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-primary/10 opacity-50 blur-3xl filter animate-blob" />{" "}
        <div className="animation-delay-4000 absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-accent/10 opacity-50 blur-3xl filter animate-blob" />{" "}
      </div>
      
      <Wrapper>
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* === Left Column: Content === */}
          <motion.div
            className="flex flex-col"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={textVariants}
          >
            <motion.div variants={textVariants}>
              <Badge
                variant="outline"
                className="border-primary/30 bg-primary/10 py-2 px-4 text-primary"
              >
                <User className="mr-2 h-4 w-4" />
                For Students
              </Badge>
            </motion.div>

            <motion.h2
              variants={textVariants}
              className="mt-6 text-3xl font-bold tracking-tighter text-foreground sm:text-4xl"
            >
              Your Personal Study Companion
            </motion.h2>

            <motion.p
              variants={textVariants}
              className="mt-4 text-lg text-muted-foreground"
            >
              Brainy adapts to your learning style, helping you master concepts
              faster and perform better in exams.
            </motion.p>

            {/* Benefits List */}
            <div className="mt-8 space-y-6">
              {studentBenefits.map((benefit) => (
                <motion.div
                  key={benefit.title}
                  variants={textVariants}
                  className="flex items-start gap-4"
                >
                  <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary">
                    <benefit.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-foreground">
                      {benefit.title}
                    </h4>
                    <p className="mt-1 text-muted-foreground">
                      {benefit.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* === Right Column: Preview card === */}
          <motion.div
            className="flex items-center justify-center transition-transform duration-300 ease-out hover:scale-105"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            variants={cardVariants}
          >
            <DashboardPreviewCard />
          </motion.div>
        </div>
      </Wrapper>
    </section>
  );
};

export default ForStudentsSection;
