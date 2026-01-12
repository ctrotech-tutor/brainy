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
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

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
      <div className="space-y-6">
        <div>
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-80 w-full" />
          <Skeleton className="h-80 w-full" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {getErrorMessage(error) || "Failed to load institution details."}
        </AlertDescription>
      </Alert>
    );
  }

  if (!institution) {
    return notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Review Application</h1>
          <p className="text-muted-foreground">
            Review details and take action on the application for{" "}
            <span className="font-semibold text-foreground">
              {institution.name}
            </span>
            .
          </p>
        </div>
        <InstitutionActions 
          institutionId={institution.id} 
          institutionName={institution.name} 
        />
      </div>

      <div className="mx-auto max-w-4xl">
        <InstitutionDetailsCard institution={institution} />
      </div>
    </div>
  );
}
