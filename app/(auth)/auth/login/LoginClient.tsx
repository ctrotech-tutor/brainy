// app/(auth)/auth/login/LoginClient.tsx
"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";
import { toast } from "sonner";
import { Loader2, Terminal } from "lucide-react";
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

// A custom component for the Google button
const GoogleButton = ({ onClick, disabled }: { onClick: () => void; disabled: boolean }) => (
  <Button variant="outline" type="button" onClick={onClick} disabled={disabled} className="w-full">
    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
      {/* SVG paths for Google icon */}
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
    Continue with Google
  </Button>
);

// A component to handle displaying errors from URL search params
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
    <Alert variant="destructive">
      <Terminal className="h-4 w-4" />
      <AlertTitle>Authentication Error</AlertTitle>
      <AlertDescription>
        {errorMessages[error] || "An unknown error occurred."}
      </AlertDescription>
    </Alert>
  );
}

export default function LoginClient() {
  const router = useRouter();

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const {mutate: login, isPending} = useMutation({
    mutationFn: async (data: LoginInput) => {
      const response = await axios.post("/api/auth/login", data);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success("Login successful! Redirecting...");
      router.push(data.redirectTo || "/dashboard");
      router.refresh(); // Important to refresh server-side session state
    },
    onError: (error: AxiosError<any>) => {
      const result = error.response?.data;
      
      const errorMessage = result?.error || "Login failed. Please check your credentials.";
      toast.error(errorMessage);

      if (result?.code === "EMAIL_NOT_VERIFIED") {
        // Redirect with a query param to show a persistent alert
        router.push(`/auth/login?error=${encodeURIComponent("Email not verified")}`);
      }
    }
  });

  const onSubmit = (data: LoginInput) => {
    login(data);
  };

  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2">
      <AuthBrandingPanel />

      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center lg:text-left">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Welcome Back
            </h1>
            <p className="mt-2 text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link href="/auth/signup" className="text-primary hover:underline font-medium">
                Sign Up
              </Link>
            </p>
          </div>

          {/* Wrap error alert in Suspense as it uses useSearchParams */}
          <Suspense fallback={null}>
            <AuthErrorAlert />
          </Suspense>

          <GoogleButton onClick={() => (window.location.href = "/api/auth/google")} disabled={isPending} />

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
                    <div className="flex items-center justify-between">
                      <FormLabel>Password</FormLabel>
                      <Link href="/auth/forgot-password" className="text-sm font-medium text-primary hover:underline">
                        Forgot Password?
                      </Link>
                    </div>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isPending} className="w-full">
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isPending ? "Signing In..." : "Sign In"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
