import { UserPlus, Brain, Trophy } from "lucide-react";

// --- Data (defined outside the component) ---
export type Step = {
  id: number;
  short: string;
  title: string;
  description: string;
  bullets?: string[];
  image?: string;
  icon?: React.ComponentType<{ className?: string }>;
};

export const STEPS: Step[] = [
  {
    id: 1,
    short: "Account",
    title: "Create Your Account",
    description:
      "Sign up quickly with your email. Your Brainy profile is the gateway to registering as a student or managing an institution.",
    bullets: ["One account, multiple roles", "Secure password & auth"],
    image: "/images/how-it-works/step1-signupp.webp",
    icon: UserPlus,
  },
  {
    id: 2,
    short: "Verify",
    title: "Verify & Join Your Institution",
    description:
      "Verify your institutional email to get full access. Institution admins can invite tutors and configure faculties and departments.",
    bullets: ["Email OTP verification", "Tutor invitation flow"],
    image: "/images/how-it-works/step2-quiz.webp",
    icon: Brain,
  },
  {
    id: 3,
    short: "Learn",
    title: "Take Smart Quizzes",
    description:
      "Engage with adaptive quizzes, timed exams, and instant feedback designed to reflect real course syllabi.",
    bullets: ["Randomized questions", "Auto-grading & analytics"],
    image: "/images/how-it-works/step3-dashboard.webp",
    icon: Trophy,
  },
];