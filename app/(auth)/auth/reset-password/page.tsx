import { Metadata } from "next";
import { Suspense } from "react";
import { AuthBrandingPanel } from "../../auth-layout";
import { ResetPasswordClient } from "./ResetPasswordClient";
import { Loader2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Create a new password for your account.",
};

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2">
      <AuthBrandingPanel />
      <div className="flex items-center justify-center p-6 sm:p-12">
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
      </div>
    </div>
  );
}
