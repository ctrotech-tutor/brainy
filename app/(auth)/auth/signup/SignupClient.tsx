"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, type SignupInput } from "@/lib/validations/auth";
import { toast } from "sonner";
import { CheckCircle2, Loader2, ArrowRight, UserPlus, Mail } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { signIn } from "next-auth/react";

// Import ShadCN Components
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Checkbox } from "@/components/ui/checkbox";

const GoogleButton = ({ onClick, disabled }: { onClick: () => void; disabled: boolean }) => (
  <Button
    variant="outline"
    type="button"
    onClick={onClick}
    disabled={disabled}
    className="h-12 w-full rounded-2xl border-border bg-muted/40 font-bold transition-all hover:bg-muted/60 hover:shadow-lg active:scale-[0.98]"
  >
    <svg className="mr-3 h-4 w-4" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
    Continue with Google
  </Button>
);

const SuccessState = () => {
  const router = useRouter();
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center text-center space-y-8 p-8 rounded-[4rem] bg-card border border-border backdrop-blur-xl shadow-2xl"
    >
      <div className="relative">
        <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
        <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary border border-primary/20">
          <Mail className="h-10 w-10" />
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-3xl font-black tracking-tighter text-foreground leading-none">
          Verify Your <span className="text-primary">Identity.</span>
        </h2>
        <p className="text-sm font-medium text-muted-foreground leading-relaxed max-w-[280px] mx-auto">
          We&apos;ve sent a cryptographic verification link to your inbox. Please secure your account by clicking it.
        </p>
      </div>

      <div className="w-full space-y-4 pt-4 border-t border-border">
        <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-muted/20 border border-border text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 text-left">
          <CheckCircle2 className="h-4 w-4 text-primary" />
          Link expires in 24 hours
        </div>

        <Button
          onClick={() => router.push("/auth/login")}
          className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-black uppercase tracking-widest shadow-xl shadow-primary/20 transition-all hover:shadow-primary/40 hover:scale-[1.02]"
        >
          Go to Login
        </Button>
      </div>
    </motion.div>
  );
};

export default function SignupClient() {
  const [showSuccess, setShowSuccess] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const searchParams = useSearchParams();

  const form = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const { mutate: signup, isPending } = useMutation({
    mutationFn: async (data: SignupInput) => {
      const intent = searchParams.get("intent");
      const url = intent ? `/api/auth/signup?intent=${intent}` : "/api/auth/signup";
      const response = await axios.post(url, data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Account initialized!");
      setShowSuccess(true);
    },
    onError: (error: AxiosError<any>) => {
      const errorMessage = error.response?.data?.error || "Signup failed. Please try again.";
      toast.error(errorMessage);
    }
  });

  const onSubmit = (data: SignupInput) => signup(data);

  const handleGoogleSignup = () => {
    setIsGoogleLoading(true);
    const intent = searchParams.get("intent");
    const callbackUrl = intent ? `/onboarding/choose-path?intent=${intent}` : "/onboarding/choose-path";
    signIn("google", { callbackUrl });
  };

  const isLoading = isPending || isGoogleLoading;

  return (
    <AnimatePresence mode="wait">
      {showSuccess ? (
        <SuccessState key="success" />
      ) : (
        <motion.div
          key="form"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.2em] text-[10px]">
              <UserPlus className="h-3 w-3" />
              Join the Hub
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-foreground leading-none">
              Create <span className="text-primary">Account.</span>
            </h1>
            <p className="text-sm font-medium text-muted-foreground">
              Returning to the standard?{" "}
              <Link href="/auth/login" className="text-foreground underline decoration-primary/30 underline-offset-4 hover:decoration-primary transition-all">
                Sign in here
              </Link>
            </p>
          </div>

          <div className="space-y-6">
            <GoogleButton onClick={handleGoogleSignup} disabled={isLoading} />

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest">
                <span className="bg-background px-4 text-muted-foreground/50">
                  Or initialize manually
                </span>
              </div>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground/80">Full Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Your identity"
                          className="h-12 rounded-xl bg-card border-border focus-visible:ring-primary/20 backdrop-blur-md transition-all sm:text-sm"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-[10px] font-bold" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground/80">Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="you@institution.edu"
                          className="h-12 rounded-xl bg-card border-border focus-visible:ring-primary/20 backdrop-blur-md transition-all sm:text-sm"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-[10px] font-bold" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground/80">Password</FormLabel>
                      <FormControl>
                        <PasswordInput
                          placeholder="••••••••"
                          className="h-12 rounded-xl bg-card border-border focus-visible:ring-primary/20 backdrop-blur-md transition-all sm:text-sm"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-[10px] font-bold" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground/80">Confirm</FormLabel>
                      <FormControl>
                        <PasswordInput
                          placeholder="••••••••"
                          className="h-12 rounded-xl bg-card border-border focus-visible:ring-primary/20 backdrop-blur-md transition-all sm:text-sm"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-[10px] font-bold" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="acceptTerms"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-xl bg-card border border-border p-4 py-3">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="rounded-md border-primary/20 data-[state=checked]:bg-primary transform transition-transform active:scale-90"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80">
                          I accept the terms and conditions
                        </FormLabel>
                      </div>
                      <FormMessage className="text-[10px] font-bold" />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="group h-14 w-full rounded-2xl bg-primary text-primary-foreground font-black uppercase tracking-widest shadow-xl shadow-primary/20 transition-all hover:shadow-primary/40 hover:scale-[1.02] active:scale-95"
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </Button>
              </form>
            </Form>

            <p className="px-8 text-center text-[10px] font-bold text-muted-foreground/40 leading-relaxed uppercase tracking-widest">
              By initializing, you agree to our{" "}
              <Link href="/terms" className="text-primary/60 hover:text-primary underline decoration-primary/20">Terms</Link>
              {" "}and{" "}
              <Link href="/privacy" className="text-primary/60 hover:text-primary underline decoration-primary/20">Privacy</Link>
              .
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
