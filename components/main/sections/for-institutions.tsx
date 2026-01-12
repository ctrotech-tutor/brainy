// components/sections/for-tutors-section.tsx
"use client";

import { Building, School, Network, ShieldCheck } from "lucide-react";
import { FeatureShowcaseSection } from "./feature-showcase";
import InstitutionDashboardVisual from "@/components/mockup/InstitutionDashboardVisual";

const institutionBenefits = [
  {
    icon: School,
    title: "Verify & Register Your Institution",
    description:
      "Register your institution and verify its authenticity to gain full access to admin dashboards and academic management tools.",
  },
  {
    icon: Network,
    title: "Manage Faculties & Departments",
    description:
      "Organize faculties and departments, assign faculty and department admins, and maintain structured academic hierarchies.",
  },
  {
    icon: ShieldCheck,
    title: "Control Tutors & Students",
    description:
      "Invite tutors, assign roles, and ensure students are verified to maintain a secure and trusted learning environment.",
  }
];

const ForInstitutionsSection = ({ noPaddingTop }: { noPaddingTop?: boolean }) => {
  return (
    <FeatureShowcaseSection
      id="for-institutions"
      className="bg-background select-none pt-0 sm:pt-0"
      layout="right"
      badge={{ icon: Building, label: "For Institutions" }}
      title="Institution-Wide Control & Integrity"
      description="Brainy helps institutions manage faculties, departments, tutors, and students efficiently, ensuring secure and verified academic assessments."
      benefits={institutionBenefits}
      visual={<InstitutionDashboardVisual />}
      noPaddingTop={noPaddingTop}
    />
  );
};

export default ForInstitutionsSection;
