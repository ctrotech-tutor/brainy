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
} from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// Define the shape of the props
interface UserActionsCardProps {
  userId: string;
  isVerified: boolean;
}

// Define the API call functions for each action
const verifyEmailAction = (userId: string) => {
  return axios.post(`/api/platform/users/${userId}/verify-email`);
};

const suspendUserAction = (userId: string) => {
  return axios.post(`/api/platform/users/${userId}/suspend`);
};

export function UserActionsCard({ userId, isVerified }: UserActionsCardProps) {
  const router = useRouter();

  // Mutation for verifying email
  const { mutate: verifyEmail, isPending: isVerifying } = useMutation({
    mutationFn: () => verifyEmailAction(userId),
    onSuccess: () => {
      toast.success("User email verified successfully.");
      router.refresh(); // Refresh the page to show the updated status
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to verify email.");
    },
  });

  // Mutation for suspending user
  const { mutate: suspendUser, isPending: isSuspending } = useMutation({
    mutationFn: () => suspendUserAction(userId),
    onSuccess: () => {
      toast.success("User has been suspended.");
      router.refresh();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to suspend user.");
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5" />
          Admin Actions
        </CardTitle>
        <CardDescription>
          Perform administrative actions on this user&apos;s account.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button
          variant="outline"
          className="w-full justify-start gap-2"
          disabled={isVerified || isVerifying}
          onClick={() => verifyEmail()}
        >
          {isVerifying ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <MailCheck className="h-4 w-4" />
          )}
          <span>{isVerified ? "Email Already Verified" : "Manually Verify Email"}</span>
        </Button>

        <Button
          variant="outline"
          className="w-full justify-start gap-2"
          onClick={() => alert("Password reset functionality to be implemented.")}
        >
          <KeyRound className="h-4 w-4" />
          <span>Send Password Reset</span>
        </Button>

        <Button
          variant="destructive"
          className="w-full justify-start gap-2"
          disabled={isSuspending}
          onClick={() => {
            if (confirm("Are you sure you want to suspend this user? This action can be reversed.")) {
              suspendUser();
            }
          }}
        >
          {isSuspending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <UserX className="h-4 w-4" />
          )}
          <span>Suspend User</span>
        </Button>
      </CardContent>
    </Card>
  );
}
