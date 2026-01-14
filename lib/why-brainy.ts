// lib/why-brainy.ts
import { School, ShieldCheck, BarChart3, Users, Scaling } from "lucide-react";
// config/why-brainy.ts

// --- 1. UPDATE THE IMPORT PATH ---
import {
  InstitutionVisual,
  SecurityVisual,
  AnalyticsVisual,
  MultiRoleVisual,
  ScalableVisual,
} from "@/components/main/sections/why-brainy-visuals";

// ---  Data Structure and Content ---

/**
 * Defines the data structure for a single "Reason" to choose Brainy.
 * This ensures type safety and consistency.
 */
export type Reason = {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
  visual: React.ElementType;
};

/**
 * An array containing the data for the five core reasons.
 * This is the single source of truth for the "Why Brainy?" section.
 */
export const whyBrainyReasons: Reason[] = [
  {
    id: "for-institutions",
    icon: School,
    title: "Built for Real Institutions",
    description:
      "Our platform is designed with a top-down, institution-centric approach, not as a simple tool retrofitted for academic use.",
    visual: InstitutionVisual,
  },
  {
    id: "secure-verified",
    icon: ShieldCheck,
    title: "Secure & Verified by Default",
    description:
      "From institutional email verification to role-based access, we prioritize a secure and trusted environment for all users.",
    visual: SecurityVisual,
  },
  {
    id: "analytics-insights",
    icon: BarChart3,
    title: "Actionable Analytics & Insights",
    description:
      "Go beyond simple scores. Our analytics help tutors identify learning gaps and students track their personal growth.",
    visual: AnalyticsVisual,
  },
  {
    id: "multi-role-platform",
    icon: Users,
    title: "A True Multi-Role Platform",
    description:
      "Admins, tutors, and students each get a tailored dashboard and toolset designed specifically for their needs and responsibilities.",
    visual: MultiRoleVisual,
  },
];
