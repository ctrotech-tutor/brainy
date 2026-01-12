import Link from "next/link";
import { ArrowRight, University, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Student Onboarding",
  description: "Set up your student profile",
};

export default function StudentOnboardingStartPage() {
  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2">
      {/* Left Panel: Visuals & Context */}
      <div className="relative hidden lg:flex flex-col items-center justify-center bg-muted/40 p-10 text-center">
        <div className="aurora-bg" />
        <div className="relative z-10 flex flex-col items-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border bg-background/50 text-primary">
            <University className="h-10 w-10" />
          </div>
          <h1 className="text-4xl font-bold tracking-tighter text-foreground">
            Student Verification
          </h1>
          <p className="mt-4 max-w-sm text-lg text-foreground/80">
            Connecting your account to a verified institution unlocks powerful, personalized learning tools.
          </p>
        </div>
      </div>

      {/* Right Panel: Information & Action */}
      <div className="flex w-full items-center justify-center bg-background p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div>
            <Badge variant="outline">Step 1 of 2</Badge>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground">
              Let&apos; Get You Verified
            </h2>
            <p className="mt-2 text-lg text-muted-foreground">
              To get started, you&apos;ll need to provide a few details to confirm your student status.
            </p>
          </div>

          {/* Information Needed Section */}
          <div className="space-y-6 rounded-lg border bg-background/30 p-6">
            <h3 className="font-semibold text-foreground">
              Please have the following ready:
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 shrink-0 text-primary" />
                <span className="text-muted-foreground">Your official university-issued email address.</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 shrink-0 text-primary" />
                <span className="text-muted-foreground">Your matriculation or student ID number.</span>
              </li>
            </ul>
          </div>

          {/* Call to Action */}
          <div>
            <Button size="lg" className="w-full text-base" asChild>
              <Link href="/onboarding/student/details">
                Continue
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <p className="mt-4 text-center text-sm text-muted-foreground">
              You are one step away from your personalized dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
