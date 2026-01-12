// components/sections/for-students-section.tsx
"use client";

import { User, TrendingUp, Target, Award } from "lucide-react";
import { FeatureShowcaseSection } from "./feature-showcase";
import StudentDashboardPreviewCard from "@/components/mockup/StudentDashboardVisual";

const studentBenefits = [
  { icon: TrendingUp, title: "Performance Tracking", description: "Monitor your progress across all courses with detailed analytics and insights." },
  { icon: Target, title: "Targeted Practice", description: "Focus on weak areas with personalized quiz recommendations." },
  { icon: Award, title: "Compete & Excel", description: "Challenge classmates and climb leaderboards to stay motivated." },
];

const ForStudentsSection = ({ noPaddingTop }: { noPaddingTop?: boolean }) => {
  return (
    <FeatureShowcaseSection
      id="for-students"
      className="bg-background select-none pt-0 sm:pt-0"
      layout="right"
      badge={{ icon: User, label: "For Students" }}
      title="Your Personal Study Companion"
      description="Brainy adapts to your learning style, helping you master concepts faster and perform better in exams."
      benefits={studentBenefits}
      visual={<StudentDashboardPreviewCard />}
      noPaddingTop={noPaddingTop}
    />
  );
};

export default ForStudentsSection;
