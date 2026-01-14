"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema, type ForgotPasswordInput } from "@/lib/validations/auth";
import { toast } from "sonner";
import { ArrowLeft, CheckCircle2, Loader2, MailCheck, KeyRound } from "lucide-react";
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

const SuccessState = ({ email, onReset }: { email: string; onReset: () => void }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="flex flex-col items-center justify-center text-center space-y-8 p-8 rounded-[3rem] bg-card/30 border border-white/5 backdrop-blur-xl shadow-2xl"
  >
    <div className="relative">
      <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
      <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary border border-primary/20">
        <MailCheck className="h-10 w-10" />
      </div>
    </div>

    <div className="space-y-3">
      <h2 className="text-3xl font-black tracking-tighter text-foreground leading-none">
        Check Your <span className="text-primary">Inbox.</span>
      </h2>
      <p className="text-sm font-medium text-muted-foreground leading-relaxed max-w-[280px] mx-auto">
        If an account exists for <span className="text-foreground font-bold">{email}</span>, you&apos;ll receive a secure recovery link shortly.
      </p>
    </div>

    <div className="w-full space-y-4 pt-4 border-t border-white/5">
      <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/2 border border-white/5 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 text-left">
        <CheckCircle2 className="h-4 w-4 text-primary" />
        Link expires in 60 minutes
      </div>

      <div className="grid grid-cols-1 gap-3">
        <Button asChild className="h-14 rounded-2xl bg-primary text-primary-foreground font-black uppercase tracking-widest shadow-xl shadow-primary/20 transition-all hover:shadow-primary/40 hover:scale-[1.02]">
          <Link href="/auth/login">Return to Hub</Link>
        </Button>
        <Button variant="ghost" onClick={onReset} className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 hover:text-primary transition-colors">
          Use different email
        </Button>
      </div>
    </div>
  </motion.div>
);

export default function ForgotPasswordClient() {
  const [showSuccess, setShowSuccess] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const { mutate: forgotPassword, isPending } = useMutation({
    mutationFn: async (data: ForgotPasswordInput) => {
      const response = await axios.post("/api/auth/forgot-password", data);
      return response.data;
    },
    onSuccess: (data, variables) => {
      toast.success("Recovery sequence initiated.");
      setSubmittedEmail(variables.email);
      setShowSuccess(true);
    },
    onError: (error: AxiosError<any>) => {
      const errorMessage = error.response?.data?.error || "Shield active: Could not send reset link.";
      toast.error(errorMessage);
    }
  });

  const onSubmit = (data: ForgotPasswordInput) => forgotPassword(data);

  return (
    <AnimatePresence mode="wait">
      {showSuccess ? (
        <SuccessState key="success" email={submittedEmail} onReset={() => setShowSuccess(false)} />
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
              Recovery Mode
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-foreground leading-none">
              Lost Your <span className="text-primary">Key?</span>
            </h1>
            <p className="text-sm font-medium text-muted-foreground">
              No problem. Initialize a recovery sequence via your institutional email.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                        className="h-12 rounded-xl bg-card border-white/5 focus-visible:ring-primary/20 backdrop-blur-md transition-all sm:text-sm"
                        {...field}
                        autoFocus
                      />
                    </FormControl>
                    <FormMessage className="text-[10px] font-bold" />
                  </FormItem>
                )}
              />
              <div className="space-y-4">
                <Button
                  type="submit"
                  disabled={isPending}
                  className="h-14 w-full rounded-2xl bg-primary text-primary-foreground font-black uppercase tracking-widest shadow-xl shadow-primary/20 transition-all hover:shadow-primary/40 hover:scale-[1.02] active:scale-95"
                >
                  {isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : "Send Recovery Link"}
                </Button>

                <Button variant="ghost" asChild className="w-full h-12 rounded-xl text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 hover:text-primary transition-colors">
                  <Link href="/auth/login">
                    <ArrowLeft className="mr-2 h-3 w-3" />
                    Back to Login
                  </Link>
                </Button>
              </div>
            </form>
          </Form>

          <p className="text-center text-[10px] font-bold text-muted-foreground/40 leading-relaxed uppercase tracking-widest">
            Security audit log: Recovery attempts are <br />
            logged against the originating IP.
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
