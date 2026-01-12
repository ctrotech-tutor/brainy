// app/(auth)/auth/forgot-password/ForgotPasswordClient.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema, type ForgotPasswordInput } from "@/lib/validations/auth";
import { toast } from "sonner";
import { ArrowLeft, CheckCircle2, Loader2, MailCheck } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

// Import the reusable branding panel
import { AuthBrandingPanel } from "../../auth-layout";

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

// A custom component for the success state after sending the email
const SuccessState = ({ email, onReset }: { email: string; onReset: () => void }) => (
  <div className="w-full max-w-md space-y-6 text-center">
    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/20 text-success mx-auto">
      <MailCheck className="h-8 w-8" />
    </div>
    <div>
      <h2 className="text-2xl font-bold text-foreground mb-2">Check Your Email</h2>
      <p className="text-muted-foreground">
        We&apos;ve sent a password reset link to   

        <span className="font-semibold text-foreground">{email}</span>.
      </p>
    </div>
    <Alert>
      <CheckCircle2 className="h-4 w-4" />
      <AlertTitle>Note</AlertTitle>
      <AlertDescription>
        The link expires in 1 hour. If you don&apos;t see the email, please check your spam folder.
      </AlertDescription>
    </Alert>
    <div className="space-y-3">
      <Button asChild className="w-full">
        <Link href="/auth/login">Back to Login</Link>
      </Button>
      <Button variant="outline" onClick={onReset} className="w-full">
        Use a different email
      </Button>
    </div>
  </div>
);

export default function ForgotPasswordClient() {
  const [showSuccess, setShowSuccess] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const {mutate: forgotPassword, isPending} = useMutation({
    mutationFn: async (data: ForgotPasswordInput) => {
      const response = await axios.post("/api/auth/forgot-password", data);
      return response.data;
    },
    onSuccess: (data, variables) => {
      toast.success("Password reset email sent!");
      setSubmittedEmail(variables.email);
      setShowSuccess(true);
    },
    onError: (error: AxiosError<any>) => {
      const errorMessage = error.response?.data?.error || "Failed to send reset email. Please try again.";
      toast.error(errorMessage);
    }
  });

  const onSubmit = (data: ForgotPasswordInput) => {
    forgotPassword(data);
  };

  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2">
      <AuthBrandingPanel />

      <div className="flex items-center justify-center p-6 sm:p-12">
        {showSuccess ? (
          <SuccessState email={submittedEmail} onReset={() => setShowSuccess(false)} />
        ) : (
          <div className="w-full max-w-md space-y-6">
            <div className="text-center lg:text-left">
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                Forgot Your Password?
              </h1>
              <p className="mt-2 text-muted-foreground">
                No problem. Enter your email and we&apos;ll send you a reset link.
              </p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="you@example.com"
                          {...field}
                          autoFocus
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isPending} className="w-full">
                  {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isPending ? "Sending Link..." : "Send Reset Link"}
                </Button>
              </form>
            </Form>

            <Button variant="ghost" asChild className="w-full">
              <Link href="/auth/login">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Login
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
