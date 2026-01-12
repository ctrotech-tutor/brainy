// app/(onboarding)/onboarding/institution/details/page.tsx
import { Metadata } from "next";
import InstitutionDetailsClient from "./InstitutionDetailsClient";

export const metadata: Metadata = {
  title: "Institution Details",
  description: "Enter your institution's details",
};

export default function InstitutionDetailsPage() {
  return <InstitutionDetailsClient />;
}
