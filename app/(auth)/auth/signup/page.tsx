import { Suspense } from "react";
import { Metadata } from "next";
import SignupClient from "./SignupClient";
import { Loader2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Get started with us today",
};

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <SignupClient />
    </Suspense>
  );
}
