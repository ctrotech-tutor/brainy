"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  MailCheck,
  UserX,
  KeyRound,
  Loader2,
  ShieldAlert,
  Sparkles
} from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface UserActionsCardProps {
  userId: string;
  isVerified: boolean;
}

const verifyEmailAction = (userId: string) => {
  return axios.post(`/api/platform/users/${userId}/verify-email`);
};

const suspendUserAction = (userId: string) => {
  return axios.post(`/api/platform/users/${userId}/suspend`);
};

export function UserActionsCard({ userId, isVerified }: UserActionsCardProps) {
  const router = useRouter();

  const { mutate: verifyEmail, isPending: isVerifying } = useMutation({
    mutationFn: () => verifyEmailAction(userId),
    onSuccess: () => {
      toast.success("Identity synchronized successfully.");
      router.refresh();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Protocol verification failed.");
    },
  });

  const { mutate: suspendUser, isPending: isSuspending } = useMutation({
    mutationFn: () => suspendUserAction(userId),
    onSuccess: () => {
      toast.success("Identity node terminated.");
      router.refresh();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Termination protocol failed.");
    },
  });

  return (
    <Card className="relative overflow-hidden rounded-[2.5rem] border-white/5 bg-white/5 backdrop-blur-xl shadow-2xl">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      <CardHeader className="pb-6">
        <div className="inline-flex items-center gap-2 text-primary font-black uppercase tracking-[0.2em] text-[10px] mb-2">
          <ShieldCheck className="h-3.5 w-3.5" />
          Governance Protocols
        </div>
        <CardTitle className="text-xl font-black tracking-tighter text-white uppercase leading-none">
          Registry <span className="text-primary italic">Actions.</span>
        </CardTitle>
        <CardDescription className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest mt-2 leading-relaxed">
          Execute administrative overrides on this identity node.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start h-11 rounded-xl border-white/5 bg-white/5 text-[10px] font-black uppercase tracking-widest gap-3 transition-all active:scale-95",
            isVerified ? "opacity-50 grayscale cursor-not-allowed" : "hover:bg-emerald-500/10 hover:border-emerald-500/40 text-emerald-500"
          )}
          disabled={isVerified || isVerifying}
          onClick={() => verifyEmail()}
        >
          {isVerifying ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <MailCheck className="h-3.5 w-3.5" />
          )}
          <span>{isVerified ? "Status: Verified" : "Manifest Verification"}</span>
        </Button>

        <Button
          variant="outline"
          className="w-full justify-start h-11 rounded-xl border-white/5 bg-white/5 text-[10px] font-black uppercase tracking-widest gap-3 transition-all active:scale-95 hover:bg-primary/10 hover:border-primary/40 text-primary"
          onClick={() => alert("Protocol: Sending cryptographic reset parameters.")}
        >
          <KeyRound className="h-3.5 w-3.5" />
          <span>Reset Credentials</span>
        </Button>

        <div className="pt-4 mt-2 border-t border-white/5">
          <div className="flex items-center gap-2 mb-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground/20">
            <ShieldAlert className="h-3 w-3 text-rose-500" />
            Critical Overrides
          </div>
          <Button
            variant="outline"
            className="w-full justify-start h-11 rounded-xl border-rose-500/10 bg-rose-500/5 text-rose-500 hover:bg-rose-500/10 hover:border-rose-500/40 text-[10px] font-black uppercase tracking-widest gap-3 transition-all active:scale-95"
            disabled={isSuspending}
            onClick={() => {
              if (confirm("Initiate identity termination protocol? This action is reversible but significant.")) {
                suspendUser();
              }
            }}
          >
            {isSuspending ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <UserX className="h-3.5 w-3.5" />
            )}
            <span>Terminate Access</span>
          </Button>
        </div>

        <div className="mt-4 flex items-center justify-center gap-2 text-[8px] font-black uppercase tracking-[0.3em] text-muted-foreground/20">
          <Sparkles className="h-2.5 w-2.5" />
          Governance Level 04 Active
        </div>
      </CardContent>
    </Card>
  );
}
