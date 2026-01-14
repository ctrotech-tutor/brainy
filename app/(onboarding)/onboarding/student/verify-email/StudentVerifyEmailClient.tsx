"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, MailCheck, ShieldAlert, ShieldCheck, Sparkles, RefreshCcw } from "lucide-react";
import axios from "axios";
import Link from "next/link";
import { motion } from "framer-motion";
import { institutionVerificationSchema } from "@/lib/validations/institution";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { cn } from "@/lib/utils";

// --- API Functions ---
const verifyStudentOtp = async (payload: { token: string; pin: string }) => {
  const { data } = await axios.post("/api/onboarding/student/verify", payload);
  return data;
};

const resendStudentOtp = async (token: string) => {
  const { data } = await axios.put("/api/onboarding/student/verify", { token });
  return data;
};

function VerifyStudentFormComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const verificationToken = searchParams.get("token");

  const form = useForm<{ token: string; pin: string }>({
    resolver: zodResolver(institutionVerificationSchema),
    defaultValues: { pin: "", token: verificationToken || "" },
  });

  const { mutate: submitVerification, isPending: isVerifying } = useMutation({
    mutationFn: verifyStudentOtp,
    onSuccess: (data) => {
      toast.success("Identity Verified: Handshake Complete.");
      router.push(data.redirectTo || "/onboarding/complete");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Shield Active: Invalid Protocol Code.");
      form.resetField("pin");
    },
  });

  const { mutate: resendCode, isPending: isResending } = useMutation({
    mutationFn: () => resendStudentOtp(verificationToken!),
    onSuccess: (data) => { toast.info("New Protocol Code dispatched."); },
    onError: (error: any) => { toast.error("Transmission Failure: Could not dispatch code."); },
  });

  const handleFormSubmit = (data: { token: string; pin: string }) => submitVerification(data);

  if (!verificationToken) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center text-center space-y-8 p-8 rounded-[3rem] bg-destructive/5 border border-destructive/10 backdrop-blur-xl"
      >
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10 text-destructive border border-destructive/20 shadow-xl">
          <ShieldAlert className="h-10 w-10" />
        </div>
        <div className="space-y-3">
          <h2 className="text-3xl font-black tracking-tighter text-foreground leading-none">
            Link <span className="text-destructive">Invalid.</span>
          </h2>
          <p className="text-sm font-medium text-muted-foreground leading-relaxed max-w-[280px] mx-auto">
            This verification sequence is missing institutional metadata.
          </p>
        </div>
        <Button asChild variant="outline" className="w-full h-14 rounded-2xl border-white/10 bg-white/5 font-black uppercase tracking-widest hover:bg-white/10">
          <Link href="/onboarding/student/details">Initialize New Sequence</Link>
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="w-full space-y-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-3"
      >
        <div className="inline-flex items-center gap-2 text-primary font-black uppercase tracking-[0.2em] text-[10px]">
          <MailCheck className="h-3 w-3" />
          Protocol Sequence 04
        </div>
        <h1 className="text-4xl font-black tracking-tighter text-foreground leading-[1.1]">
          Final <span className="text-primary italic">Authentication.</span>
        </h1>
        <p className="text-sm font-medium text-muted-foreground">
          Enter the 6-digit protocol code dispatched to your institutional inbox.
        </p>
      </motion.div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8">
          <div className="p-8 rounded-[2.5rem] bg-card/30 border border-white/5 backdrop-blur-xl shadow-2xl flex flex-col items-center space-y-8">
            <FormField
              control={form.control}
              name="pin"
              render={({ field }) => (
                <FormItem className="flex flex-col items-center space-y-4">
                  <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">Institutional PIN</FormLabel>
                  <FormControl>
                    <InputOTP maxLength={6} {...field}>
                      <InputOTPGroup className="gap-3 sm:gap-4">
                        {[0, 1, 2, 3, 4, 5].map((i) => (
                          <InputOTPSlot
                            key={i}
                            index={i}
                            className="h-14 w-10 sm:h-16 sm:w-14 rounded-xl bg-card border-white/5 text-xl font-black focus:ring-primary/20 transition-all border-2"
                          />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage className="text-[10px] font-bold" />
                </FormItem>
              )}
            />

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/2 border border-white/5 w-full">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <p className="text-[10px] font-bold text-muted-foreground/60 leading-relaxed uppercase tracking-widest">
                Verification ensures your academic profile is cryptographically linked to your institution.
              </p>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center gap-6"
          >
            <Button
              type="submit"
              disabled={isVerifying || isResending}
              className="group h-16 w-full max-w-sm rounded-[1.25rem] bg-primary text-primary-foreground font-black uppercase tracking-widest shadow-2xl shadow-primary/20 transition-all hover:shadow-primary/40 hover:scale-[1.02] active:scale-95"
            >
              {isVerifying ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <>
                  Complete Identity Sequence
                  <ShieldCheck className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                </>
              )}
            </Button>

            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => resendCode()}
                disabled={isResending || isVerifying}
                className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 hover:text-primary transition-colors inline-flex items-center gap-2 group"
              >
                <RefreshCcw className={cn("h-3 w-3 transition-transform duration-500", isResending && "animate-spin")} />
                Dispatched another code
              </button>
            </div>
          </motion.div>
        </form>
      </Form>
    </div>
  );
}

export default function StudentVerifyEmailClient() {
  return (
    <Suspense fallback={
      <div className="flex items-center gap-2 text-muted-foreground font-black uppercase tracking-widest text-xs">
        <Loader2 className="h-4 w-4 animate-spin text-primary" />
        Establishing Secure Tunnel...
      </div>
    }>
      <VerifyStudentFormComponent />
    </Suspense>
  );
}
