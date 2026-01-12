// app/(auth)/auth/signup/SignupClient.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, type SignupInput } from "@/lib/validations/auth";
import { toast } from "sonner";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useSearchParams } from "next/navigation";

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
import { AuthBrandingPanel } from "../../auth-layout";

// A custom component for the Google button to keep the main component clean
const GoogleButton = ({ onClick, disabled }: { onClick: () => void; disabled: boolean }) => (
  <Button
    variant="outline"
    type="button"
    onClick={onClick}
    disabled={disabled}
    className="w-full"
  >
    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
    Continue with Google
  </Button>
);

// A custom component for the success state
const SuccessState = () => {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center text-center space-y-6">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/20 text-success">
        <CheckCircle2 className="h-8 w-8" />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Check Your Email!</h2>
        <p className="text-muted-foreground max-w-sm">
          We&apos;ve sent a verification link to your email. Please click the link to complete your registration.
        </p>
      </div>
      <div className="w-full rounded-lg bg-accent p-4 border border-border">
        <p className="text-sm text-accent-foreground">
          <strong>Note:</strong> The link expires in 24 hours. If you don&apos;t see it, check your spam folder.
        </p>
      </div>
      <Button onClick={() => router.push("/auth/login")} className="w-full">
        Go to Login
      </Button>
    </div>
  );
};

export default function SignupClient() {
  const [showSuccess, setShowSuccess] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const searchParams = useSearchParams();

  const form = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const {mutate: signup, isPending} = useMutation({
    mutationFn: async (data: SignupInput) => {
      const intent = searchParams.get("intent");
      const url = intent ? `/api/auth/signup?intent=${intent}` : "/api/auth/signup";
      const response = await axios.post(url, data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Account created! Check your email to verify.");
      setShowSuccess(true);
    },
    onError: (error: AxiosError<any>) => {
      const errorMessage = error.response?.data?.error || "Signup failed. Please try again.";
      toast.error(errorMessage);
    }
  });

  const onSubmit = (data: SignupInput) => {
    signup(data);
  };

  const handleGoogleSignup = () => {
    // This can be a loading state while redirecting
    setIsGoogleLoading(true);
    const intent = searchParams.get("intent");
    const url = intent ? `/api/auth/google?intent=${intent}` : "/api/auth/google";
    window.location.href = url;
  };

  const isLoading = isPending || isGoogleLoading;

  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2">
      <AuthBrandingPanel />

      {/* Right Panel: Form */}
      <div className="flex items-center justify-center p-6 sm:p-12">
        {showSuccess ? (
          <SuccessState />
        ) : (
          <div className="w-full max-w-md space-y-6">
            <div className="text-center lg:text-left">
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                Create an Account
              </h1>
              <p className="mt-2 text-muted-foreground">
                Already have an account?{" "}
                <Link href="/auth/login" className="text-primary hover:underline font-medium">
                  Sign In
                </Link>
              </p>
            </div>

            <GoogleButton onClick={handleGoogleSignup} disabled={isLoading} />

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with email
                </span>
              </div>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="you@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
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
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>
              </form>
            </Form>

            <p className="px-8 text-center text-sm text-muted-foreground">
              By creating an account, you agree to our{" "}
              <Link href="/terms" className="underline hover:text-primary">
                Terms
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="underline hover:text-primary">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
