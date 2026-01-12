// app/(auth)/auth/signup/page.tsx
import { Metadata } from "next";
import SignupClient from "./SignupClient";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Get started with us today",
};

export default function SignupPage() {
  return <SignupClient />;
}
