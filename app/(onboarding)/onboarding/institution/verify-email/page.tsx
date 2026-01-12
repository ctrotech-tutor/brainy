// app/(onboarding)/onboarding/institution/verify-email/page.tsx
import { Metadata } from "next";
import InstitutionVerifyEmailClient from "./InstitutionVerifyEmailClient";

export const metadata: Metadata = {
  title: "Verify Email",
  description: "Verify your institution's email address",
};

export default function InstitutionVerifyEmailPage() {
  return <InstitutionVerifyEmailClient />;
}
