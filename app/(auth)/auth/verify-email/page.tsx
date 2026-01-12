// app/(auth)/verify-email/page.tsx
import { Metadata } from "next";
import { Suspense } from "react";
import { AuthBrandingPanel } from "../../auth-layout";
import { VerifyEmailClient } from "./VerifyEmailClient";

export const metadata: Metadata = {
  title: "Verify Email",
  description: "Verify your email address to continue.",
};

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2">
      <AuthBrandingPanel />
      <div className="flex items-center justify-center p-6 sm:p-12">
        {/* Suspense is crucial here for the client component that uses searchParams */}
        <Suspense fallback={<div>Loading...</div>}>
          <VerifyEmailClient />
        </Suspense>
      </div>
    </div>
  );
}
