"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { CheckCircle2, Loader2, XCircle, ShieldCheck, ShieldAlert, ArrowRight } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { motion, AnimatePresence } from "framer-motion";

// Import ShadCN Components
import { Button } from "@/components/ui/button";

type Status = "verifying" | "success" | "error" | "no_token";

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
      title: "Verifying Identity...",
      message: "Our verification nodes are validating your secure token.",
      actions: null,
      color: "primary"
    },
    success: {
      icon: (
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary border border-primary/20">
            <ShieldCheck className="h-10 w-10" />
          </div>
        </div>
      ),
      title: "Handshake Complete!",
      message: "Your institutional identity has been cryptographically verified.",
      actions: (
        <Button
          onClick={() => {
            router.push(redirectTo);
            router.refresh();
          }}
          className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-black uppercase tracking-widest shadow-xl shadow-primary/20 transition-all hover:shadow-primary/40 hover:scale-[1.02]"
        >
          Initialize Dashboard
        </Button>
      ),
      color: "primary"
    },
    error: {
      icon: (
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10 text-destructive border border-destructive/20">
          <ShieldAlert className="h-10 w-10" />
        </div>
      ),
      title: "Verification Failed",
      message: errorMessage || "The verification token is invalid or has expired.",
      actions: (
        <Button asChild variant="outline" className="w-full h-14 rounded-2xl border-white/10 bg-white/5 font-black uppercase tracking-widest hover:bg-white/10">
          <Link href="/auth/login">Return to Login</Link>
        </Button>
      ),
      color: "destructive"
    },
    no_token: {
      icon: (
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10 text-destructive border border-destructive/20">
          <XCircle className="h-10 w-10" />
        </div>
      ),
      title: "Missing Sequence",
      message: "No verification sequence was detected. Please check your link.",
      actions: (
        <Button asChild variant="outline" className="w-full h-14 rounded-2xl border-white/10 bg-white/5 font-black uppercase tracking-widest hover:bg-white/10">
          <Link href="/auth/login">Back to Login</Link>
        </Button>
      ),
      color: "destructive"
    },
  };

  const currentStatus = statusConfig[status];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center text-center space-y-8 p-8 rounded-[3rem] bg-card/30 border border-white/5 backdrop-blur-xl shadow-2xl"
    >
      <div className="mb-2">{currentStatus.icon}</div>
      <div className="space-y-3">
        <h2 className="text-3xl font-black tracking-tighter text-foreground leading-none">
          {currentStatus.title}
        </h2>
        <p className="text-sm font-medium text-muted-foreground leading-relaxed max-w-[280px] mx-auto">
          {currentStatus.message}
        </p>
      </div>

      {currentStatus.actions && (
        <div className="w-full pt-4 border-t border-white/5">
          {currentStatus.actions}
        </div>
      )}

      {status === "verifying" && (
        <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest animate-pulse">
          Establishing secure tunnel...
        </p>
      )}
    </motion.div>
  );
};

export function VerifyEmailClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const initialState: Status = useMemo(() => (token ? "verifying" : "no_token"), [token]);

  const [status, setStatus] = useState<Status>(initialState);
  const [errorMessage, setErrorMessage] = useState("");
  const [redirectTo, setRedirectTo] = useState("/dashboard");

  const { mutate: verifyToken } = useMutation({
    mutationFn: async (tokenToVerify: string) => {
      const response = await axios.post("/api/auth/verify-email", { token: tokenToVerify });
      return response.data;
    },
    onSuccess: (data) => {
      setStatus("success");
      setRedirectTo(data.redirectTo || "/dashboard");
      toast.success("Identity verified.");
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
    if (token && status === "verifying") {
      verifyToken(token);
    }
  }, [token, status, verifyToken]);

  return <StatusBox status={status} errorMessage={errorMessage} redirectTo={redirectTo} />;
}
