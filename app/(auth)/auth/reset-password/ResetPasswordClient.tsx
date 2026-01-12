// app/(auth)/reset-password/ResetPasswordClient.tsx
"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  resetPasswordSchema,
  type ResetPasswordInput,
} from "@/lib/validations/auth";
import { toast } from "sonner";
import { CheckCircle2, KeyRound, Loader2, XCircle } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

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

// Component for the success state
const SuccessState = () => {
  const router = useRouter();
  return (
    <div className="w-full max-w-md space-y-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/20 text-success mx-auto">
        <CheckCircle2 className="h-8 w-8" />
      </div>
      <div>
        <h2 className="text-2xl font-bold">Password Reset!</h2>
        <p className="text-muted-foreground">
          Your password has been changed. You will be redirected to the
          dashboard.
        </p>
      </div>
      <Button onClick={() => router.push("/dashboard")} className="w-full">
        Continue to Dashboard
      </Button>
    </div>
  );
};

// Component for the invalid token state
const InvalidTokenState = () => (
  <div className="w-full max-w-md space-y-6 text-center">
    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/20 text-destructive mx-auto">
      <XCircle className="h-8 w-8" />
    </div>
    <div>
      <h2 className="text-2xl font-bold">Invalid Link</h2>
      <p className="text-muted-foreground">
        This password reset link is invalid or has expired. Please request a new
        one.
      </p>
    </div>
    <Button asChild className="w-full">
      <Link href="/auth/forgot-password">Request New Link</Link>
    </Button>
  </div>
);

// Main client component
export function ResetPasswordClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [showSuccess, setShowSuccess] = useState(false);

  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const {mutate: resetPassword, isPending} = useMutation({
    mutationFn: async (data: ResetPasswordInput) => {
      if (!token) throw new Error("Missing token");
      const response = await axios.post("/api/auth/reset-password", {
        token,
        password: data.password,
      });
      return response.data;
    },
    onSuccess: (data) => {
      toast.success("Password reset successfully!");
      setShowSuccess(true);
      setTimeout(() => {
        router.push(data.redirectTo || "/dashboard");
        router.refresh();
      }, 3000);
    },
    onError: (error: AxiosError<any>) => {
      const errorMessage = error.response?.data?.error || "Failed to reset password.";
      toast.error(errorMessage);
    }
  });

  const onSubmit = (data: ResetPasswordInput) => {
    resetPassword(data);
  };

  // If the token is missing, show an error state immediately.
  if (!token) {
    return <InvalidTokenState />;
  }

  // If the form was submitted successfully, show the success state.
  if (showSuccess) {
    return <SuccessState />;
  }

  // Otherwise, show the form.
  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-center lg:text-left">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Set a New Password
        </h1>
        <p className="mt-2 text-muted-foreground">
          Create a new, strong password for your account.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    {...field}
                    autoFocus
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm New Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Alert variant="default">
            <KeyRound className="h-4 w-4" />
            <AlertTitle>Password Requirements</AlertTitle>
            <AlertDescription>
              Must be at least 8 characters and include a mix of uppercase,
              lowercase, numbers, and special characters.
            </AlertDescription>
          </Alert>
          <Button type="submit" disabled={isPending} className="w-full">
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isPending ? "Resetting Password..." : "Set New Password"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
