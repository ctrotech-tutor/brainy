import { UserPlus, Network, GraduationCap } from "lucide-react";

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
    short: "Sign Up & Verify",
    title: "Create Your Account & Verify Institution",
    description:
      "Users create a Networky account. Institutions register and verify their details to ensure authenticity and gain access to dashboards.",
    bullets: [
      "Fast email signup",
      "Institutional verification",
      "Secure authentication",
    ],
    image: "/images/how-it-works/step1-signup.webp",
    icon: UserPlus,
  },
  {
    id: 2,
    short: "Assign Roles & Setup",
    title: "Add Faculties, Departments, and Tutors",
    description:
      "Institution admins organize faculties and departments, assign faculty admins, and invite tutors to manage courses and quizzes.",
    bullets: [
      "Create faculties & departments",
      "Assign admins and tutors",
      "Set up courses & quizzes",
    ],
    image: "/images/how-it-works/step2-quiz.webp",
    icon: Network,
  },
  {
    id: 3,
    short: "Engage & Track",
    title: "Students Take Quizzes & Track Performance",
    description:
      "Students enroll under verified institutions, take quizzes, and monitor their results while tutors and admins track progress.",
    bullets: [
      "Student enrollment & verification",
      "Secure quizzes with instant results",
      "Analytics, leaderboards, and insights",
    ],
    image: "/images/how-it-works/step3-dashboard.webp",
    icon: GraduationCap,
  },
];
