import { Metadata } from "next";
import { Suspense } from "react";
import { ResetPasswordClient } from "./ResetPasswordClient";
import { Loader2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Create a new password for your account.",
};

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading...</span>
        </div>
      }
    >
      <ResetPasswordClient />
    </Suspense>
  );
}
