// app/(onboarding)/onboarding/student/verify-email/page.tsx
import { Metadata } from "next";
import StudentVerifyEmailClient from "./StudentVerifyEmailClient";

export const metadata: Metadata = {
  title: "Verify Student Email",
  description: "Verify your student email address",
};

export default function StudentVerifyEmailPage() {
  return <StudentVerifyEmailClient />;
}
