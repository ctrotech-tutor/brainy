// app/(onboarding)/onboarding/institution/verify-email/InstitutionVerifyEmailClient.tsx
"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, MailCheck, ShieldAlert, ArrowLeft } from "lucide-react";
import axios from "axios";
import Link from "next/link";
import { institutionVerificationSchema, type InstitutionVerificationInput } from "@/lib/validations/institution";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Badge } from "@/components/ui/badge";

// --- API Functions ---
const checkTokenValidity = async (token: string) => {
  const { data } = await axios.post("/api/onboarding/institution/verify/check", { token });
  return data;
};

const verifyInstitutionOtp = async (payload: InstitutionVerificationInput) => {
  const { data } = await axios.post("/api/onboarding/institution/verify", payload);
  return data;
};

const resendInstitutionOtp = async (token: string) => {
  const { data } = await axios.put("/api/onboarding/institution/verify", { token });
  return data;
};

// The main component that handles the logic and renders different states
function VerifyInstitutionFormComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const verificationToken = searchParams.get("token");

  // --- Step 1: Validate the token's existence and validity on page load ---
  const { data: tokenValidation, isPending: isCheckingToken, isError } = useQuery({
    queryKey: ["verifyInstitutionToken", verificationToken],
    queryFn: () => checkTokenValidity(verificationToken!),
    enabled: !!verificationToken, // Only run if the token exists in the URL
    retry: 1, // Retry once on network error
    refetchOnWindowFocus: false, // No need to re-check on window focus
  });

  const form = useForm<InstitutionVerificationInput>({
    resolver: zodResolver(institutionVerificationSchema),
    defaultValues: { pin: "", token: verificationToken || "" },
  });

  // --- Step 2: Define mutations for form submission and resending ---
  const { mutate: submitVerification, isPending: isVerifying } = useMutation({
    mutationFn: verifyInstitutionOtp,
    onSuccess: (data) => {
      toast.success(data.message || "Email verified!");
      router.push(data.redirectTo || "/onboarding/institution/pending-approval");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Invalid code. Please try again.");
      form.resetField("pin");
    },
  });

  const { mutate: resendCode, isPending: isResending } = useMutation({
    mutationFn: () => resendInstitutionOtp(verificationToken!),
    onSuccess: (data) => { toast.info(data.message || "A new code has been sent."); },
    onError: (error: any) => { toast.error(error.response?.data?.error || "Failed to resend code."); },
  });

  const handleFormSubmit = (data: InstitutionVerificationInput) => {
    submitVerification(data);
  };

  // --- Step 3: Render UI based on the current state ---

  // State 1: Loading/Checking the token
  if (isCheckingToken) {
    return (
      <div className="flex flex-col items-center justify-center text-center space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground">Verifying your link...</p>
      </div>
    );
  }

  // State 2: Token is missing, invalid, or expired
  if (!verificationToken || isError || !tokenValidation?.isValid) {
    return (
      <div className="w-full max-w-md space-y-6 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-destructive bg-destructive/10 text-destructive">
          <ShieldAlert className="h-8 w-8" />
        </div>
        <div>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground">Invalid or Expired Link</h2>
          <p className="mt-2 text-muted-foreground">This verification link is invalid or has expired. Please return and try the previous step again.</p>
        </div>
        <Button size="lg" className="w-full" asChild>
          <Link href="/onboarding/institution/details">
            <ArrowLeft className="mr-2 h-5 w-5" />
            Return to Institution Details
          </Link>
        </Button>
      </div>
    );
  }

  // State 3: Token is valid, render the OTP form
  return (
    <div className="w-full max-w-md space-y-6">
      <div>
        <Badge variant="outline">Final Step</Badge>
        <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground">Verify Your Email</h2>
        <p className="mt-2 text-muted-foreground">Enter the 6-digit code sent to your official institution email to submit your application for review.</p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8">
          <FormField name="token" control={form.control} render={({ field }) => <input type="hidden" {...field} />} />
          <FormField
            control={form.control}
            name="pin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>One-Time Password</FormLabel>
                <FormControl>
                  <InputOTP maxLength={6} {...field}>
                    <InputOTPGroup className="w-full justify-between">
                      <InputOTPSlot index={0} /><InputOTPSlot index={1} /><InputOTPSlot index={2} />
                      <InputOTPSlot index={3} /><InputOTPSlot index={4} /><InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormDescription>Please enter the 6-digit code from your email.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isVerifying || isResending} className="w-full text-base">
            {isVerifying && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isVerifying ? "Verify and Submit for Approval" : "Verify and Submit for Approval"}
          </Button>
        </form>
      </Form>
      <div className="text-center text-sm text-muted-foreground">
        Didn&apos;t receive a code?{" "}
        <Button variant="link" className="p-0 h-auto" onClick={() => resendCode()} disabled={isResending || isVerifying}>
          {isResending ? "Sending..." : "Resend Code"}
        </Button>
      </div>
    </div>
  );
}

export default function InstitutionVerifyEmailClient() {
  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2">
      {/* Left Panel */}
      <div className="relative hidden lg:flex flex-col items-center justify-center bg-muted/40 p-10 text-center">
        <div className="aurora-bg" />
        <div className="relative z-10 flex flex-col items-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border bg-background/50 text-primary">
            <MailCheck className="h-10 w-10" />
          </div>
          <h1 className="text-4xl font-bold tracking-tighter text-foreground">Final Confirmation</h1>
          <p className="mt-4 max-w-sm text-lg text-foreground/80">This final step confirms your authority to register the institution and submits your application for review.</p>
        </div>
      </div>
      {/* Right Panel */}
      <div className="flex w-full items-center justify-center bg-background p-6 sm:p-12">
        <Suspense fallback={<div className="w-full max-w-md flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
          <VerifyInstitutionFormComponent />
        </Suspense>
      </div>
    </div>
  );
}
