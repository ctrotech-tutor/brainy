"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, ShieldCheck, Mail, ArrowLeft, ShieldAlert, Sparkles, RefreshCcw } from "lucide-react";
import axios from "axios";
import Link from "next/link";
import { institutionVerificationSchema, type InstitutionVerificationInput } from "@/lib/validations/institution";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { motion, AnimatePresence } from "framer-motion";

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

function VerifyInstitutionFormComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const verificationToken = searchParams.get("token");

  const { data: tokenValidation, isPending: isCheckingToken, isError } = useQuery({
    queryKey: ["verifyInstitutionToken", verificationToken],
    queryFn: () => checkTokenValidity(verificationToken!),
    enabled: !!verificationToken,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const form = useForm<InstitutionVerificationInput>({
    resolver: zodResolver(institutionVerificationSchema),
    defaultValues: { pin: "", token: verificationToken || "" },
  });

  const { mutate: submitVerification, isPending: isVerifying } = useMutation({
    mutationFn: verifyInstitutionOtp,
    onSuccess: (data) => {
      toast.success("Identity Verified: Handshake Complete.");
      router.push(data.redirectTo || "/onboarding/institution/pending-approval");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Shield Active: Invalid Protocol Code.");
      form.resetField("pin");
    },
  });

  const [isResendSpinning, setIsResendSpinning] = useState(false);
  const { mutate: resendCode, isPending: isResending } = useMutation({
    mutationFn: () => resendInstitutionOtp(verificationToken!),
    onMutate: () => setIsResendSpinning(true),
    onSuccess: (data) => { 
        toast.info("Resend Protocol: New code transmitted.");
        setIsResendSpinning(false);
    },
    onError: (error: any) => { 
        toast.error("Signal Failure: Resend blocked.");
        setIsResendSpinning(false);
    },
  });

  const handleFormSubmit = (data: InstitutionVerificationInput) => {
    submitVerification(data);
  };

  if (isCheckingToken) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center space-y-6">
        <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full animate-pulse" />
            <Loader2 className="h-12 w-12 animate-spin text-primary relative z-10" />
        </div>
        <div className="space-y-2">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Validating Link Header</p>
            <p className="text-xs font-bold text-muted-foreground/60 uppercase tracking-widest">Awaiting system response...</p>
        </div>
      </div>
    );
  }

  if (!verificationToken || isError || !tokenValidation?.isValid) {
    return (
      <div className="w-full space-y-8 py-8 px-4 text-center">
        <div className="relative mx-auto h-24 w-24 flex items-center justify-center rounded-[2.5rem] bg-card/30 border border-white/5 backdrop-blur-xl shadow-2xl">
            <div className="absolute inset-0 bg-destructive/10 blur-xl rounded-full" />
            <ShieldAlert className="h-10 w-10 text-destructive relative z-10" />
        </div>
        
        <div className="space-y-3">
          <h2 className="text-3xl font-black tracking-tighter text-foreground uppercase">Protocol <span className="text-destructive">Terminated.</span></h2>
          <p className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.2em] leading-relaxed max-w-xs mx-auto">
            This verification link is invalid or has expired. The current registry sequence has been flushed for security.
          </p>
        </div>

        <Button 
            className="h-14 w-full max-w-sm rounded-2xl bg-white/5 border border-white/10 font-black uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all text-white" 
            asChild
        >
          <Link href="/onboarding/institution/details">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Restart Registry Sequence
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full space-y-10">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 text-primary font-black uppercase tracking-[0.2em] text-[10px]">
          <Mail className="h-3.5 w-3.5" />
          Final Confirmation Node
        </div>
        <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground leading-none">
          Verify <span className="text-primary italic">Identity.</span>
        </h2>
        <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-[0.2em] leading-relaxed max-w-xs mx-auto">
          Enter the 6-digit security code dispatched to your institutional administrative node.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-10">
          <FormField name="token" control={form.control} render={({ field }) => <input type="hidden" {...field} />} />
          
          <div className="flex justify-center">
            <FormField
                control={form.control}
                name="pin"
                render={({ field }) => (
                <FormItem className="space-y-6">
                    <FormControl>
                    <InputOTP maxLength={6} {...field} className="gap-2">
                        <InputOTPGroup className="gap-3">
                            {[0, 1, 2, 3, 4, 5].map((index) => (
                                <InputOTPSlot 
                                    key={index}
                                    index={index} 
                                    className="h-16 w-12 md:w-14 text-xl font-black bg-card/50 border-white/10 rounded-[1rem] focus:ring-primary/20 backdrop-blur-md"
                                />
                            ))}
                        </InputOTPGroup>
                    </InputOTP>
                    </FormControl>
                    <FormMessage className="text-center text-[10px] font-bold uppercase tracking-widest" />
                </FormItem>
                )}
            />
          </div>

          <div className="flex flex-col items-center gap-6">
            <Button 
                type="submit" 
                disabled={isVerifying || isResending} 
                className="h-16 w-full max-w-sm rounded-[1.25rem] bg-primary text-primary-foreground font-black uppercase tracking-widest shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
            >
                {isVerifying ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                    <>
                        Authorize & Commit
                        <ShieldCheck className="ml-2 h-5 w-5" />
                    </>
                )}
            </Button>

            <div className="flex flex-col items-center gap-4">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">
                    <Sparkles className="h-3 w-3" />
                    Secure Transfer Phase 03
                </div>
                
                <button 
                    type="button"
                    onClick={() => resendCode()} 
                    disabled={isResending || isVerifying}
                    className="group text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary/80 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                    <RefreshCcw className={`h - 3.5 w - 3.5 ${ isResendSpinning ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500' } `} />
                    {isResending ? "Transmitting..." : "Resend Protocol Code"}
                </button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default function InstitutionVerifyEmailClient() {
  return (
    <Suspense fallback={
        <div className="w-full flex flex-col items-center justify-center p-20 gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary opacity-20" />
            <div className="h-2 w-32 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                    className="h-full w-full bg-primary/20"
                />
            </div>
        </div>
    }>
      <VerifyInstitutionFormComponent />
    </Suspense>
  );
}
