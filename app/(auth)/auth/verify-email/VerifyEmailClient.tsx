// app/(auth)/verify-email/VerifyEmailClient.tsx
"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

import { Button } from "@/components/ui/button";

type Status = "verifying" | "success" | "error" | "no_token";

// A dynamic component to show the current status
const StatusBox = ({
  status,
  errorMessage,
  redirectTo,
}: {
  status: Status;
  errorMessage: string;
  redirectTo: string;
}) => {
  const router = useRouter();

  const statusConfig = {
    verifying: {
      icon: <Loader2 className="h-12 w-12 text-primary animate-spin" />,
      title: "Verifying Your Email...",
      message: "Please wait a moment.",
      actions: null,
    },
    success: {
      icon: (
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/20 text-success">
          <CheckCircle2 className="h-8 w-8" />
        </div>
      ),
      title: "Email Verified!",
      message: "You will be redirected to your dashboard shortly.",
      actions: (
        <Button
          onClick={() => {
            router.push(redirectTo);
            router.refresh();
          }}
          className="w-full"
        >
          Continue to Dashboard
        </Button>
      ),
    },
    error: {
      icon: (
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/20 text-destructive">
          <XCircle className="h-8 w-8" />
        </div>
      ),
      title: "Verification Failed",
      message: errorMessage,
      actions: (
        <Button asChild className="w-full">
          <Link href="/auth/login">Back to Login</Link>
        </Button>
      ),
    },
    no_token: {
      icon: (
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/20 text-destructive">
          <XCircle className="h-8 w-8" />
        </div>
      ),
      title: "Invalid Link",
      message: "No verification token was found. Please check the link and try again.",
      actions: (
        <Button asChild className="w-full">
          <Link href="/auth/login">Back to Login</Link>
        </Button>
      ),
    },
  };

  const currentStatus = statusConfig[status];

  return (
    <div className="flex flex-col items-center text-center space-y-6">
      {currentStatus.icon}
      <h2 className="text-2xl font-bold">{currentStatus.title}</h2>
      <p className="text-muted-foreground">{currentStatus.message}</p>
      {currentStatus.actions}
    </div>
  );
};

// The main client component that handles the verification logic
export function VerifyEmailClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  // We use useMemo to ensure this calculation only happens when the token changes.
  const initialState: Status = useMemo(() => (token ? "verifying" : "no_token"), [token]);

  const [status, setStatus] = useState<Status>(initialState);
  const [errorMessage, setErrorMessage] = useState("");
  const [redirectTo, setRedirectTo] = useState("/dashboard");

  const {mutate: verifyToken} = useMutation({
    mutationFn: async (tokenToVerify: string) => {
      const response = await axios.post("/api/auth/verify-email", { token: tokenToVerify });
      return response.data;
    },
    onSuccess: (data) => {
      setStatus("success");
      setRedirectTo(data.redirectTo || "/dashboard");
      toast.success("Email verified successfully! Redirecting...");
      setTimeout(() => {
        router.push(data.redirectTo || "/dashboard");
        router.refresh();
      }, 3000);
    },
    onError: (error: AxiosError<any>) => {
       const msg = error.response?.data?.error || "This link is invalid or has expired.";
       setStatus("error");
       setErrorMessage(msg);
       toast.error(msg);
    }
  });

  useEffect(() => {
    // The effect should ONLY run if there's a token to verify and we haven't already succeeded or failed hard (state is verifying)
    if (token && status === "verifying") {
        verifyToken(token);
    }
  }, [token, status, verifyToken]);

  return <StatusBox status={status} errorMessage={errorMessage} redirectTo={redirectTo} />;
}
