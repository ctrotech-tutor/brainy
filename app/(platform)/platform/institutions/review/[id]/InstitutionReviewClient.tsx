// app/(platform)/platform/institutions/review/[id]/InstitutionReviewClient.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { notFound, useParams } from "next/navigation";
import { getErrorMessage } from "@/lib/utils";

// Import UI and Child Components
import { Skeleton } from "@/components/ui/skeleton";
import { InstitutionDetailsCard } from "./_components/details-card";
import { InstitutionActions } from "@/components/platform/InstitutionActions";
import { AlertCircle, FileSearch, Sparkles } from "lucide-react";

import type { InstitutionReviewData } from "@/app/(platform)/_types";

// Custom hook to fetch institution details
const useInstitution = (id: string) => {
  return useQuery({
    queryKey: ["institution", id],
    queryFn: async () => {
      try {
        const { data } = await axios.get<InstitutionReviewData>(
          `/api/platform/institutions/${id}`
        );
        return data;
      } catch (error: any) {
        if (error.response?.status === 404) {
          return null;
        }
        throw error;
      }
    },
    retry: 1,
  });
};

export default function InstitutionReviewClient() {
  const params = useParams();
  const id = params.id as string;

  const { data: institution, isPending, isError, error } = useInstitution(id);

  if (isPending) {
    return (
      <div className="space-y-10">
        <div className="space-y-3">
          <Skeleton className="h-4 w-32 bg-white/5" />
          <Skeleton className="h-10 w-96 bg-white/5" />
          <Skeleton className="h-4 w-64 bg-white/5" />
        </div>
        <div className="mx-auto max-w-4xl">
          <Skeleton className="h-[600px] w-full rounded-[2.5rem] bg-white/5" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center rounded-[3rem] border border-dashed border-white/10 bg-white/5 py-24 text-center">
        <div className="h-20 w-20 rounded-3xl bg-destructive/10 flex items-center justify-center mb-6">
          <AlertCircle className="h-10 w-10 text-destructive" />
        </div>
        <h3 className="text-xl font-black tracking-tighter text-foreground uppercase">Review Interrupted</h3>
        <p className="mt-2 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest max-w-xs mx-auto">
          {getErrorMessage(error) || "Protocol handshake failed."}
        </p>
      </div>
    );
  }

  if (!institution) {
    return notFound();
  }

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 text-primary font-black uppercase tracking-[0.2em] text-[10px]">
            <FileSearch className="h-3 w-3" />
            Registry Manifest Review
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground leading-none">
            {institution.name.split(' ')[0]} <span className="text-primary italic">{institution.name.split(' ').slice(1).join(' ')}.</span>
          </h1>
          <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-[0.2em] leading-relaxed max-w-md">
            Auditing institutional parameters and cryptographic identity for node validation.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-md mr-2">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Audit active</span>
          </div>
          <InstitutionActions
            institutionId={institution.id}
            institutionName={institution.name}
          />
        </div>
      </div>

      <div className="mx-auto max-w-4xl">
        <InstitutionDetailsCard institution={institution} />
      </div>
    </div>
  );
}
