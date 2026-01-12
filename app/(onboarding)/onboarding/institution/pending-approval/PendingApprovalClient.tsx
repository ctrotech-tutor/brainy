// app/onboarding/institution/pending-approval/PendingApprovalClient.tsx
"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Hourglass, ShieldCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function PendingApprovalClient() {
  const router = useRouter();

  // This could be a link to a limited dashboard or a general user dashboard.
  const handleContinue = () => {
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-muted/40 p-4 sm:p-8">
      <div className="relative w-full max-w-3xl">
        {/* Background decorative elements */}
        <div className="aurora-bg" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative w-full space-y-8 rounded-2xl border bg-background/80 p-8 text-center shadow-lg backdrop-blur-sm sm:p-12"
        >
          {/* 1. The Icon and Header */}
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-2 border-amber-500/50 bg-amber-500/10 text-amber-500">
            <Hourglass className="h-10 w-10" />
          </div>
          <div className="space-y-2">
            <Badge variant="secondary">Application Submitted</Badge>
            <h1 className="text-4xl font-bold tracking-tight text-foreground">
              Your Application is Under Review
            </h1>
          </div>

          {/* 2. The Explanation */}
          <p className="mx-auto max-w-xl text-lg text-muted-foreground">
            Thank you for submitting your institution&apos;s details. Our team will now perform a human review to ensure the integrity and credibility of our platform.
          </p>

          {/* 3. The Process Timeline */}
          <div className="grid grid-cols-1 gap-6 rounded-lg border bg-muted/50 p-6 text-left sm:grid-cols-2">
            <div className="flex items-start gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">What Happens Next?</h3>
                <p className="text-sm text-muted-foreground">
                  A platform administrator will review your submission. This step is crucial to maintain a trusted academic environment.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">How Will I Know?</h3>
                <p className="text-sm text-muted-foreground">
                  You will receive an email notification as soon as a decision is made, typically within **24-48 business hours**.
                </p>
              </div>
            </div>
          </div>

          {/* 4. The Call to Action */}
          <div className="pt-6">
            <Button size="lg" className="group w-full max-w-xs mx-auto" onClick={handleContinue}>
              Continue to Your Dashboard
              <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
            <p className="mt-4 text-xs text-muted-foreground">
              Your dashboard will have limited functionality until your institution is approved.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
