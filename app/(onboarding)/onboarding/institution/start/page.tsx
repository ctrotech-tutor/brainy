import Link from "next/link";
import { ArrowRight, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Institution Onboarding",
  description: "Register your institution",
};

export default function InstitutionOnboardingStartPage() {
  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2">
      {/* Left Panel: Visuals & Context */}
      <div className="relative hidden lg:flex flex-col items-center justify-center bg-muted/40 p-10 text-center">
        <div className="aurora-bg" />
        <div className="relative z-10 flex flex-col items-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border bg-background/50 text-primary">
            <Building className="h-10 w-10" />
          </div>
          <h1 className="text-4xl font-bold tracking-tighter text-foreground">
            Register Your Institution
          </h1>
          <p className="mt-4 max-w-sm text-lg text-foreground/80">
            Join a growing network of modern academic institutions using Brainy to deliver secure and scalable assessments.
          </p>
        </div>
      </div>

      {/* Right Panel: Information & Action */}
      <div className="flex w-full items-center justify-center bg-background p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div>
            <Badge variant="outline">Step 1 of 3</Badge>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground">
              Begin Your Registration
            </h2>
            <p className="mt-2 text-lg text-muted-foreground">
              Let&apos;s get your institution set up on the platform. The process is simple and secure.
            </p>
          </div>

          {/* Information Needed Section */}
          <div className="space-y-6 rounded-lg border bg-background/30 p-6">
            <h3 className="font-semibold text-foreground">
              Here&apos;s what the process looks like:
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">1</div>
                <span className="text-muted-foreground">
                  Provide your institution&apos;s official details and contact information.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">2</div>
                <span className="text-muted-foreground">
                  Verify ownership via a one-time code sent to your official institution email.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">3</div>
                <span className="text-muted-foreground">
                  Once approved by our team, your institution&apos;s dashboard will be activated.
                </span>
              </li>
            </ul>
          </div>

          {/* Call to Action */}
          <div>
            <Button size="lg" className="w-full text-base" asChild>
              <Link href="/onboarding/institution/details">
                Start Registration
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <p className="mt-4 text-center text-sm text-muted-foreground">
              Our team reviews all new institution registrations within 24 hours.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
