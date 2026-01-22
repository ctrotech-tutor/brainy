"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ShieldCheck, ShieldAlert, X, Loader2, AlertTriangle, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface InstitutionActionsProps {
  institutionId: string;
  institutionName: string;
}

export function InstitutionActions({
  institutionId,
  institutionName,
}: InstitutionActionsProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const handleApprove = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(
        `/api/platform/institutions/review/${institutionId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "APPROVE" }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to approve institution");
      }

      toast.success(`${institutionName} has been approved!`);
      router.push("/platform/institutions/pending");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to approve institution"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `/api/platform/institutions/review/${institutionId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "REJECT",
            reason: rejectionReason.trim(),
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to reject institution");
      }

      toast.success(`${institutionName} has been rejected`);
      setShowRejectModal(false);
      router.push("/platform/institutions/pending");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to reject institution"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-3">
        <Button
          onClick={handleApprove}
          disabled={isLoading}
          className="rounded-xl bg-emerald-500 text-white shadow-2xl shadow-emerald-500/20 hover:bg-emerald-600 transition-all active:scale-95 text-[10px] font-black uppercase tracking-widest px-6 h-10 gap-2"
        >
          {isLoading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <ShieldCheck className="h-3.5 w-3.5" />
          )}
          {isLoading ? "Validating..." : "Authorize Node"}
        </Button>

        <Button
          onClick={() => setShowRejectModal(true)}
          disabled={isLoading}
          variant="outline"
          className="rounded-xl border-rose-500/20 bg-rose-500/5 text-rose-500 hover:bg-rose-500/10 hover:border-rose-500/40 transition-all active:scale-95 text-[10px] font-black uppercase tracking-widest px-6 h-10 gap-2"
        >
          <ShieldAlert className="h-3.5 w-3.5" />
          Terminate Request
        </Button>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => !isLoading && setShowRejectModal(false)}
          />
          <div className="relative w-full max-w-md rounded-[2.5rem] border border-white/10 bg-black/80 backdrop-blur-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-2 text-rose-500 font-black uppercase tracking-[0.2em] text-[10px]">
                    <AlertTriangle className="h-3 w-3" />
                    Security Exception
                  </div>
                  <h2 className="text-2xl font-black text-white tracking-tighter uppercase">
                    Termination <span className="text-rose-500 italic">Protocol.</span>
                  </h2>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowRejectModal(false)}
                  className="rounded-full hover:bg-white/5 transition-colors"
                >
                  <X className="h-5 w-5 text-muted-foreground" />
                </Button>
              </div>

              <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-[0.2em] leading-relaxed mb-6">
                Please provide the justification for terminating the registry request for <span className="text-white italic">&quot;{institutionName}&quot;</span>.
              </p>

              <div className="space-y-4">
                <div className="relative group">
                  <textarea
                    id="reason"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    rows={4}
                    placeholder="E.G., VERIFICATION FAILURE, DUPLICATE ENTITY..."
                    className="w-full rounded-2xl border border-white/5 bg-white/5 px-4 py-3 text-xs font-bold uppercase tracking-tight text-white placeholder:text-muted-foreground/20 focus:outline-none focus:ring-1 focus:ring-rose-500/40 focus:border-rose-500/40 transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 px-8 py-6 bg-white/5 border-t border-white/5">
              <Button
                variant="ghost"
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectionReason("");
                }}
                disabled={isLoading}
                className="rounded-xl hover:bg-white/5 text-[10px] font-black uppercase tracking-widest px-6"
              >
                Abort
              </Button>

              <Button
                onClick={handleReject}
                disabled={isLoading || !rejectionReason.trim()}
                className="rounded-xl bg-rose-500 text-white shadow-2xl shadow-rose-500/20 hover:bg-rose-600 transition-all active:scale-95 text-[10px] font-black uppercase tracking-widest px-6"
              >
                {isLoading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin mr-2" />
                ) : (
                  <ShieldAlert className="h-3.5 w-3.5 mr-2" />
                )}
                {isLoading ? "Terminating..." : "Confirm Termination"}
              </Button>
            </div>

            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-rose-500/20 to-transparent" />
          </div>
        </div>
      )}
    </>
  );
}
