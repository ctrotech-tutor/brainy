import { Metadata } from "next";
import { Suspense } from "react";
import { VerifyEmailClient } from "./VerifyEmailClient";
import { Loader2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Verify Email",
  description: "Verify your email address to continue.",
};

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Verifying...</span>
        </div>
      }
    >
      <VerifyEmailClient />
    </Suspense>
  );
}
