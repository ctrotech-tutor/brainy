import { BarChart3, BookOpen, Brain, Database, Gauge, LayoutDashboard, Palette, ShieldCheck, Smartphone, Trophy, Zap } from "lucide-react";



export type Feature = {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  sub: string[];
};

export const features: Feature[] = [
  {
    title: "Smart Quiz Engine",
    description:
      "An intelligent, scalable quiz system designed to handle university-level courses with adaptive logic, real-time evaluation, and deep analytics.",
    icon: Brain,
    sub: [
      "Timed and untimed quizzes",
      "Auto-grading with instant feedback",
      "Randomized questions and options",
      "Adaptive difficulty support",
    ],
  },
  {
    title: "University Course Coverage",
    description:
      "Built to support multiple academic courses and departments with proper structuring and scalability.",
    icon: BookOpen,
    sub: [
      "CSC, GNS, MTH, PHY, CHM, BIO courses",
      "Semester and level-based organization",
      "Course-specific quiz rules",
      "Expandable course catalog",
    ],
  },
  {
    title: "Student Dashboard",
    description:
      "A personalized academic space for students to track progress, performance, and growth.",
    icon: LayoutDashboard,
    sub: [
      "Quiz history and attempt logs",
      "Performance analytics and charts",
      "Progress tracking by course",
      "Achievement badges and ranks",
    ],
  },
  {
    title: "Admin Control Panel",
    description:
      "A powerful admin system for managing content, users, and platform behavior with precision.",
    icon: ShieldCheck,
    sub: [
      "Create and manage quizzes",
      "Question bank management",
      "User and role management",
      "Analytics and reports",
    ],
  },
  {
    title: "Advanced Question Bank",
    description:
      "A flexible and reusable question system supporting multiple formats and reuse across quizzes.",
    icon: Database,
    sub: [
      "Objective and theory questions",
      "Image-based and diagram questions",
      "Difficulty tagging",
      "Bulk import and export",
    ],
  },
  {
    title: "Real-Time Results & Feedback",
    description:
      "Immediate result generation with insightful explanations to enhance learning.",
    icon: Zap,
    sub: [
      "Instant score calculation",
      "Correct answer explanations",
      "Performance breakdown per topic",
      "Review mode after submission",
    ],
  },
  {
    title: "Leaderboard & Rankings",
    description:
      "Motivating competitive features that encourage consistency and excellence.",
    icon: Trophy,
    sub: [
      "Global leaderboard",
      "Course-specific rankings",
      "Weekly and monthly rankings",
      "Top performers highlights",
    ],
  },
  {
    title: "Authentication & Security",
    description:
      "Secure and modern authentication flows designed for production-grade applications.",
    icon: ShieldCheck,
    sub: [
      "Email and password authentication",
      "OAuth (Google, etc.)",
      "Role-based access control",
      "Protected routes and sessions",
    ],
  },
  {
    title: "Responsive & Accessible Design",
    description:
      "A clean, mobile-first interface that works seamlessly across all devices.",
    icon: Smartphone,
    sub: [
      "Mobile, tablet, and desktop support",
      "Dark and light mode",
      "Keyboard and screen-reader friendly",
      "Fast and smooth animations",
    ],
  },
  {
    title: "Performance & Scalability",
    description:
      "Engineered for speed, reliability, and future growth.",
    icon: Gauge,
    sub: [
      "Optimized loading and caching",
      "Scalable backend architecture",
      "Edge and server rendering support",
      "Production-ready deployments",
    ],
  },
  {
    title: "Insights & Analytics",
    description:
      "Actionable data insights for both students and administrators.",
    icon: BarChart3,
    sub: [
      "Student performance trends",
      "Quiz difficulty analysis",
      "Participation and engagement metrics",
      "Exportable reports",
    ],
  },
  {
    title: "Branding & Customization",
    description:
      "A flexible system that reflects the Brainy identity by Ctrotech Tutor Insights.",
    icon: Palette,
    sub: [
      "Custom color schemes",
      "Institution-ready branding",
      "Configurable UI components",
      "Future white-label support",
    ],
  },
];
