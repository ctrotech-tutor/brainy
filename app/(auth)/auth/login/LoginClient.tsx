"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";
import { toast } from "sonner";
import { Loader2, Terminal, ArrowRight, ShieldCheck } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { motion } from "framer-motion";

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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const GoogleButton = ({ onClick, disabled }: { onClick: () => void; disabled: boolean }) => (
  <Button
    variant="outline"
    type="button"
    onClick={onClick}
    disabled={disabled}
    className="h-12 w-full rounded-2xl border-white/10 bg-white/5 font-bold transition-all hover:bg-white/10 hover:shadow-lg active:scale-[0.98]"
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

function AuthErrorAlert() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  if (!error) return null;

  const errorMessages: { [key: string]: string } = {
    oauth_failed: "OAuth authentication failed. Please try again.",
    invalid_oauth_state: "Invalid authentication state. Please try again.",
    "Email not verified": "Your email is not verified. Please check your inbox.",
  };

  return (
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
      <Alert variant="destructive" className="rounded-2xl border-destructive/20 bg-destructive/5 backdrop-blur-md">
        <Terminal className="h-4 w-4" />
        <AlertTitle className="font-bold tracking-tight">Authentication Error</AlertTitle>
        <AlertDescription className="text-sm font-medium">
          {errorMessages[error] || "An unknown error occurred."}
        </AlertDescription>
      </Alert>
    </motion.div>
  );
}

export default function LoginClient() {
  const router = useRouter();

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const { mutate: login, isPending } = useMutation({
    mutationFn: async (data: LoginInput) => {
      const response = await axios.post("/api/auth/login", data);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success("Welcome back!");
      router.push(data.redirectTo || "/dashboard");
      router.refresh();
    },
    onError: (error: AxiosError<any>) => {
      const result = error.response?.data;
      const errorMessage = result?.error || "Check your credentials and try again.";
      toast.error(errorMessage);

      if (result?.code === "EMAIL_NOT_VERIFIED") {
        router.push(`/auth/login?error=${encodeURIComponent("Email not verified")}`);
      }
    }
  });

  const onSubmit = (data: LoginInput) => {
    login(data);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.2em] text-[10px]">
          <ShieldCheck className="h-3 w-3" />
          Secure Access
        </div>
        <h1 className="text-4xl font-black tracking-tighter text-foreground leading-none">
          Welcome <span className="text-primary">Back.</span>
        </h1>
        <p className="text-sm font-medium text-muted-foreground">
          New to the standard?{" "}
          <Link href="/auth/signup" className="text-foreground underline decoration-primary/30 underline-offset-4 hover:decoration-primary transition-all">
            Initialize an account
          </Link>
        </p>
      </div>

      <Suspense fallback={null}>
        <AuthErrorAlert />
      </Suspense>

      <div className="space-y-6">
        <GoogleButton onClick={() => (window.location.href = "/api/auth/google")} disabled={isPending} />

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-white/5" />
          </div>
          <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest">
            <span className="bg-background px-4 text-muted-foreground/50">
              Or use credentials
            </span>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground/80">Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="you@institution.edu"
                      className="h-12 rounded-xl bg-card border-white/5 focus-visible:ring-primary/20 backdrop-blur-md transition-all sm:text-sm"
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
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground/80">Password</FormLabel>
                    <Link href="/auth/forgot-password" className="text-[10px] font-black uppercase tracking-widest text-primary/60 hover:text-primary transition-colors">
                      Forgot?
                    </Link>
                  </div>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      className="h-12 rounded-xl bg-card border-white/5 focus-visible:ring-primary/20 backdrop-blur-md transition-all sm:text-sm"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-[10px] font-bold" />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={isPending}
              className="group h-14 w-full rounded-2xl bg-primary text-primary-foreground font-black uppercase tracking-widest shadow-xl shadow-primary/20 transition-all hover:shadow-primary/40 hover:scale-[1.02] active:scale-95"
            >
              {isPending ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </Button>
          </form>
        </Form>
      </div>

      <p className="text-center text-[10px] font-bold text-muted-foreground/40 leading-relaxed uppercase tracking-widest">
        Protected by Brainy integrity shielding. <br />
        Unauthorized access is strictly monitored.
      </p>
    </motion.div>
  );
}
