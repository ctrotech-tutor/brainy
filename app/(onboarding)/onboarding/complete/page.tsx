// app/(onboarding)/onboarding/complete/page.tsx
import { Metadata } from "next";
import OnboardingCompleteClient from "./OnboardingCompleteClient";

export const metadata: Metadata = {
  title: "Setup Complete",
  description: "You are all set!",
};

export default function OnboardingCompletePage() {
  return <OnboardingCompleteClient />;
}
