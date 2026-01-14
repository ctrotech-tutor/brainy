"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema, type ResetPasswordInput } from "@/lib/validations/auth";
import { toast } from "sonner";
import { CheckCircle2, KeyRound, Loader2, XCircle, ShieldAlert, ArrowRight } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { motion, AnimatePresence } from "framer-motion";

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

const SuccessState = () => {
  const router = useRouter();
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center text-center space-y-8 p-8 rounded-[3rem] bg-card/30 border border-white/5 backdrop-blur-xl shadow-2xl"
    >
      <div className="relative">
        <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
        <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary border border-primary/20">
          <CheckCircle2 className="h-10 w-10" />
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-3xl font-black tracking-tighter text-foreground leading-none">
          Key Replaced <span className="text-primary">Successfully.</span>
        </h2>
        <p className="text-sm font-medium text-muted-foreground leading-relaxed max-w-[280px] mx-auto">
          Your credentials have been updated. You will be redirected to the institutional hub momentarily.
        </p>
      </div>

      <div className="w-full pt-4 border-t border-white/5">
        <Button
          onClick={() => router.push("/dashboard")}
          className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-black uppercase tracking-widest shadow-xl shadow-primary/20 transition-all hover:shadow-primary/40 hover:scale-[1.02]"
        >
          Proceed to Hub
        </Button>
      </div>
    </motion.div>
  );
};

const InvalidTokenState = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center text-center space-y-8 p-8 rounded-[3rem] bg-destructive/5 border border-destructive/10 backdrop-blur-xl"
  >
    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10 text-destructive border border-destructive/20">
      <ShieldAlert className="h-10 w-10" />
    </div>

    <div className="space-y-3">
      <h2 className="text-3xl font-black tracking-tighter text-foreground leading-none">
        Link <span className="text-destructive">Expired.</span>
      </h2>
      <p className="text-sm font-medium text-muted-foreground leading-relaxed max-w-[280px] mx-auto">
        This recovery sequence has timed out or is cryptographically invalid.
      </p>
    </div>

    <div className="w-full pt-4 border-t border-white/5">
      <Button asChild variant="outline" className="w-full h-14 rounded-2xl border-white/10 bg-white/5 font-black uppercase tracking-widest hover:bg-white/10">
        <Link href="/auth/forgot-password">Request New Sequence</Link>
      </Button>
    </div>
  </motion.div>
);

export function ResetPasswordClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [showSuccess, setShowSuccess] = useState(false);

  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const { mutate: resetPassword, isPending } = useMutation({
    mutationFn: async (data: ResetPasswordInput) => {
      if (!token) throw new Error("Missing token");
      const response = await axios.post("/api/auth/reset-password", {
        token,
        password: data.password,
      });
      return response.data;
    },
    onSuccess: (data) => {
      toast.success("Security update complete.");
      setShowSuccess(true);
      setTimeout(() => {
        router.push(data.redirectTo || "/dashboard");
        router.refresh();
      }, 3000);
    },
    onError: (error: AxiosError<any>) => {
      const errorMessage = error.response?.data?.error || "Failed to finalize security update.";
      toast.error(errorMessage);
    }
  });

  const onSubmit = (data: ResetPasswordInput) => {
    resetPassword(data);
  };

  if (!token) return <InvalidTokenState />;

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
              <KeyRound className="h-3 w-3" />
              Security Update
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-foreground leading-none">
              Reset Your <span className="text-primary">Access.</span>
            </h1>
            <p className="text-sm font-medium text-muted-foreground">
              Define a high-integrity password for your institutional hub.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground/80">New Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          className="h-12 rounded-xl bg-card border-white/5 focus-visible:ring-primary/20 backdrop-blur-md transition-all sm:text-sm"
                          {...field}
                          autoFocus
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
                      <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground/80">Confirm New Password</FormLabel>
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
              </div>

              <Alert variant="default" className="rounded-2xl border-white/5 bg-white/2 backdrop-blur-sm">
                <ShieldAlert className="h-4 w-4 text-primary" />
                <AlertTitle className="text-[10px] font-black uppercase tracking-widest text-primary">Requirement Matrix</AlertTitle>
                <AlertDescription className="text-[10px] font-bold text-muted-foreground/60 leading-relaxed">
                  8+ characters, alphanumeric complexity, and at least one special character required for institutional trust.
                </AlertDescription>
              </Alert>

              <Button
                type="submit"
                disabled={isPending}
                className="group h-14 w-full rounded-2xl bg-primary text-primary-foreground font-black uppercase tracking-widest shadow-xl shadow-primary/20 transition-all hover:shadow-primary/40 hover:scale-[1.02] active:scale-95"
              >
                {isPending ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    Finalize Reset
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </Button>
            </form>
          </Form>

          <p className="text-center text-[10px] font-bold text-muted-foreground/40 leading-relaxed uppercase tracking-widest">
            Session secured with 256-bit encryption. <br />
            Updates are instantly propagated across nodes.
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
