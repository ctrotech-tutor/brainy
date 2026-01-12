// app/(onboarding)/onboarding/choose-path/page.tsx
import { Metadata } from "next";
import ChoosePathClient from "./ChoosePathClient";

export const metadata: Metadata = {
  title: "Choose Your Path",
  description: "Select your role to get started",
};

export default function ChoosePath() {
  return <ChoosePathClient />;
}
