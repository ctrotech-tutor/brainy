"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Briefcase, Edit, BarChartHorizontal, Timer } from "lucide-react";
import { Wrapper } from "@/components/ui/wrapper";
import { Badge } from "@/components/ui/badge";
import TutorDashboardPreviewCard from "@/components/TutorDashboardPreviewCard";

// Data for the tutor benefit list
const tutorBenefits = [
  {
    icon: Edit,
    title: "Quick Quiz Creation",
    description:
      "Build comprehensive quizzes in minutes with our intuitive editor and AI-powered question bank.",
  },
  {
    icon: BarChartHorizontal,
    title: "Advanced Analytics",
    description:
      "Track class performance, identify struggling students, and optimize teaching strategies.",
  },
  {
    icon: Timer,
    title: "Auto-Grading System",
    description:
      "Save hours with instant, automated grading and detailed feedback generation.",
  },
];

const ForTutorsSection = () => {
  // Re-using the same animation variants, but they will be applied to the new layout
  const textVariants = {
    hidden: { opacity: 0, x: 20 }, // Fades in from the right
    visible: { opacity: 1, x: 0, transition: { duration: 0.5, staggerChildren: 0.1 } },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    // Using a different background to create visual separation from the previous section
    <section id="fortutors" className="bg-secondary/50 py-20 sm:py-28">
      <Wrapper>
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* === Left Column: Image (Order is flipped here) === */}
          <motion.div
            className="flex items-center justify-center lg:order-first" // 'order-first' ensures it's on the left on large screens
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            variants={imageVariants}
          >
            <TutorDashboardPreviewCard />
          </motion.div>

          {/* === Right Column: Content === */}
          <motion.div
            className="flex flex-col"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={textVariants}
          >
            <motion.div variants={textVariants}>
              <Badge variant="outline" className="border-primary/30 bg-primary/10 py-2 px-4 text-primary">
                <Briefcase className="mr-2 h-4 w-4" />
                For Tutors
              </Badge>
            </motion.div>

            <motion.h2
              variants={textVariants}
              className="mt-6 text-3xl font-bold tracking-tighter text-foreground sm:text-4xl"
            >
              Powerful Tools for Educators
            </motion.h2>

            <motion.p
              variants={textVariants}
              className="mt-4 text-lg text-muted-foreground"
            >
              Create, manage, and analyze assessments with ease. Brainy gives
              you complete control and deep insights.
            </motion.p>

            {/* Benefits List */}
            <div className="mt-8 space-y-6">
              {tutorBenefits.map((benefit) => (
                <motion.div
                  key={benefit.title}
                  variants={textVariants}
                  className="flex items-start gap-4"
                >
                  <div className="mt-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-background">
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
        </div>
      </Wrapper>
    </section>
  );
};

export default ForTutorsSection;
