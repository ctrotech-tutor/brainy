import {
  ClipboardList,
  BarChart3,
  ShieldCheck,
  Network,
} from "lucide-react";

// Feature type (unchanged)
export type Feature = {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  sub?: string[];
  image?: string;
  className?: string;
};

// Updated features with shortened descriptions
export const features: Feature[] = [
  {
    title: "Course-Based Quizzes & Assessments",
    description:
      "A powerful quiz engine for university assessments, supporting structured exams, continuous assessments, and practice tests.",
    icon: ClipboardList,
    sub: ["Multi-course support", "Timed quizzes with auto-grading"],
    image: "/images/features/course-coverage.webp",
    className: "md:col-span-2 md:row-span-2",
  },
  {
    title: "Institution & Role Management",
    description:
      "Organize institutions, faculties, and departments with role-based access for admins, tutors, and students.",
    icon: Network,
    sub: [
      "Institution verification & registration",
      "Faculty & department creation",
      "Role-based dashboards for all users",
    ],
    image: "/images/features/course-coverage.webp",
    className: "md:col-span-2",
  },
  {
    title: "Student Engagement & Analytics",
    description:
      "Track student performance with real-time results, progress insights, and competitive leaderboards.",
    icon: BarChart3,
    sub: [
      "Real-time results & progress tracking",
      "Leaderboards and performance insights",
    ],
    image: "/images/features/analytics.webp",
    className: "",
  },
  {
    title: "Secure & Verified Platform",
    description:
      "Uphold academic integrity with institutional verification, secure authentication, and controlled data access.",
    icon: ShieldCheck,
    sub: [
      "Institutional email verification",
      "OTP-based student verification",
      "Secure authentication and data",
    ],
    image: "/images/features/security.webp",
  },
];
