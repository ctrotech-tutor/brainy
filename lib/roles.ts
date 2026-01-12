// config/roles.ts
import { User, Briefcase, Building } from "lucide-react";
import {
  StudentVisual,
  TutorVisual,
  InstitutionVisual,
} from "@/components/get-started/role-visuals";

// All possible roles in the system
export const allRoles = ["student", "tutor", "institution"] as const;
export type UserRole = (typeof allRoles)[number];

// --- NEW: Define only the roles a new user can self-select ---
export const selectableRoles = ["student", "institution"] as const;
export type SelectableRole = (typeof selectableRoles)[number];

export type RoleData = {
  title: string;
  description: string;
  icon: React.ElementType;
  visual: React.ElementType;
};

// The single source of truth for all role-related data
export const roleData: Record<UserRole, RoleData> = {
  student: {
    title: "Student",
    description: "Unlock personalized study tools and track your path to success.",
    icon: User,
    visual: StudentVisual,
  },
  tutor: {
    title: "Tutor",
    description: "Craft insightful assessments and guide your students with powerful analytics.",
    icon: Briefcase,
    visual: TutorVisual,
  },
  institution: {
    title: "Institution",
    description: "Deploy a secure, scalable assessment platform across your entire organization.",
    icon: Building,
    visual: InstitutionVisual,
  },
};
