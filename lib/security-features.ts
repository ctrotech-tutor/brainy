// config/security-features.ts
import { AtSign, UserCog, UserCheck, Lock, Server } from "lucide-react";

/**
 * Defines the data structure for a single security feature highlight.
 * This ensures type safety and consistency across the application.
 */
export type SecurityFeature = {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
};

/**
 * An array containing the data for the five core security features.
 * This is the single source of truth for the Security Section.
 */
export const securityFeatures: SecurityFeature[] = [
  {
    id: "email-verification",
    icon: AtSign,
    title: "Institutional Email Verification",
    description:
      "Users must verify their identity using an official institutional email address, ensuring only legitimate members of your organization can gain access.",
  },
  {
    id: "role-based-access",
    icon: UserCog,
    title: "Role-Based Access Control (RBAC)",
    description:
      "Assign granular permissions to Admins, Tutors, and Students. Users only see the data and tools relevant to their role, protecting sensitive information.",
  },
  {
    id: "invite-only-tutors",
    icon: UserCheck,
    title: "Invitation-Only Tutor Onboarding",
    description:
      "Tutors cannot sign up freely. They must be invited by a verified institutional administrator, guaranteeing the authenticity and authority of all educators.",
  },
  {
    id: "protected-quizzes",
    icon: Lock,
    title: "Protected & Encrypted Quizzes",
    description:
      "All assessment data is encrypted in transit and at rest. Quizzes can be configured with time limits and access codes to prevent unauthorized sharing.",
  },
  {
    id: "scalable-infrastructure",
    icon: Server,
    title: "Scalable & Secure Infrastructure",
    description:
      "Built on enterprise-grade cloud infrastructure, our platform ensures high availability, data redundancy, and protection against common security threats.",
  },
];
