// app/(platform)/institutions/review/[id]/_components/action-card.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { Check, X, Loader2 } from "lucide-react";

// UI Imports
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface ActionCardProps {
  institutionId: string;
  currentStatus: string;
}

type ActionPayload = {
  action: "APPROVE" | "REJECT";
  reason?: string;
};

// API mutation function
const updateInstitutionStatus = async ({ institutionId, payload }: { institutionId: string; payload: ActionPayload }) => {
  const { data } = await axios.post(`/api/platform/institutions/review/${institutionId}`, payload);
  return data;
};

export function ActionCard({ institutionId, currentStatus }: ActionCardProps) {
  const router = useRouter();
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const { mutate, isPending } = useMutation({
    mutationFn: updateInstitutionStatus,
    onSuccess: (data) => {
      toast.success(data.message || "Institution status updated successfully!");
      // Refresh the page to show updated status or redirect
      router.refresh();
      router.push("/institutions/pending"); // Redirect back to the pending list
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "An error occurred.");
    },
  });

  const handleApprove = () => {
    mutate({ institutionId, payload: { action: "APPROVE" } });
  };

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      toast.error("A reason is required to reject an application.");
      return;
    }
    mutate({ institutionId, payload: { action: "REJECT", reason: rejectionReason } });
    setIsRejecting(false);
  };

  // If the institution is already approved or rejected, show a different state
  if (currentStatus !== "PENDING" && currentStatus !== "UNDER_REVIEW") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            This application has already been reviewed. Current status: <strong>{currentStatus.replace(/_/g, ' ')}</strong>
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Take Action</CardTitle>
          <CardDescription>Approve or reject this application.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Button
            onClick={handleApprove}
            disabled={isPending}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
            Approve
          </Button>
          <Button
            onClick={() => setIsRejecting(true)}
            disabled={isPending}
            variant="destructive"
            className="w-full"
          >
            <X className="mr-2 h-4 w-4" />
            Reject
          </Button>
        </CardContent>
      </Card>

      {/* Rejection Confirmation Dialog */}
      <AlertDialog open={isRejecting} onOpenChange={setIsRejecting}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to reject this application?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. Please provide a clear reason for the rejection, which will be logged and may be sent to the applicant.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="grid gap-2">
            <Label htmlFor="rejection-reason">Rejection Reason</Label>
            <Textarea
              id="rejection-reason"
              placeholder="e.g., Institution could not be verified, domain mismatch, etc."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleReject} disabled={!rejectionReason.trim()}>
              Confirm Rejection
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
