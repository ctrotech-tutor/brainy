// components/sections/for-tutors-section.tsx
"use client";

import { Briefcase, Edit, BarChartHorizontal, Timer } from "lucide-react";
import { FeatureShowcaseSection } from "./feature-showcase";
import TutorDashboardPreviewCard from "@/components/mockup/TutorDashboardVisual";

const tutorBenefits = [
  { icon: Edit, title: "Quick Quiz Creation", description: "Build comprehensive quizzes in minutes with our intuitive editor and AI-powered question bank." },
  { icon: BarChartHorizontal, title: "Advanced Analytics", description: "Track class performance, identify struggling students, and optimize teaching strategies." },
  { icon: Timer, title: "Auto-Grading System", description: "Save hours with instant, automated grading and detailed feedback generation." },
];

const ForTutorsSection = ({ noPaddingTop }: { noPaddingTop?: boolean }) => {
  return (
    <FeatureShowcaseSection
      id="for-tutors"
      className="bg-background select-none pt-0 sm:pt-0"
      layout="left"
      badge={{ icon: Briefcase, label: "For Tutors" }}
      title="Powerful Tools for Educators"
      description="Create, manage, and analyze assessments with ease. Brainy gives you complete control and deep insights."
      benefits={tutorBenefits}
      visual={<TutorDashboardPreviewCard />}
      noPaddingTop={noPaddingTop}
    />
  );
};

export default ForTutorsSection;
