import {
  Brain,
  // BookOpen,
  // LayoutDashboard,
  BarChart3,
  ShieldCheck,
  Layers3,
} from "lucide-react";

// Feature type (unchanged – already good)
export type Feature = {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  sub?: string[];
  image?: string;
  className?: string;
};

// Updated features aligned with Brainy platform vision
export const features: Feature[] = [
  {
    title: "Smart Assessment Engine",
    description:
      "A powerful and flexible quiz engine built for real university assessments, supporting structured exams, continuous assessments, and practice tests.",
    icon: Brain,
    sub: [
      "Timed & auto-submitted quizzes",
      "Question randomization & pools",
      "Instant grading & feedback",
      "Multiple question formats",
    ],
    image: "/images/features/smart-quiz.webp",
    className: "md:col-span-2 md:row-span-2",
  },
  {
    title: "Institution & Course Structure",
    description:
      "Brainy supports real academic structures — institutions, faculties, departments, and standardized courses like CSC 101, GNS 101, PHY 101, and more.",
    icon: Layers3,
    sub: [
      "Institution-based setup",
      "Faculty & department mapping",
      "General & departmental courses",
    ],
    image: "/images/features/course-coverage.webp",
    className: "md:col-span-2",
  },
  // {
  //   title: "Role-Based Dashboards",
  //   description:
  //     "Dedicated dashboards tailored for students, tutors, faculty admins, and institution administrators.",
  //   icon: LayoutDashboard,
  //   sub: [
  //     "Student performance tracking",
  //     "Tutor quiz & course management",
  //     "Admin oversight & controls",
  //   ],
  //   // image: "/images/features/dashboard.webp",
  // },
  {
    title: "Verified & Secure Access",
    description:
      "Ensure academic integrity with institution-based verification and controlled access across the platform.",
    icon: ShieldCheck,
    sub: [
      "Student email verification",
      "Tutor invitation system",
      "Institution approval workflow",
    ],
    image: "/images/features/verification.webp",
  },
  {
    title: "Insights & Performance Analytics",
    description:
      "Turn assessment data into actionable insights for better teaching, learning, and institutional decisions.",
    icon: BarChart3,
    sub: [
      "Score breakdowns & trends",
      "Attempt history & comparisons",
      "Institution-wide analytics",
    ],
    image: "/images/features/analytics.webp",
  },
];
