// app/(onboarding)/onboarding/institution/details/_hooks/useInstitutionForm.ts
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { institutionDetailsSchema } from "@/lib/validations/institution";

// This creates a TypeScript type from our Zod schema
export type FullInstitutionInput = z.infer<typeof institutionDetailsSchema>;

export const useInstitutionForm = () => {
  // Initialize react-hook-form with our schema
  const form = useForm<FullInstitutionInput>({
    resolver: zodResolver(institutionDetailsSchema),
    defaultValues: {
      country: "Nigeria",
      state: "",
      lga: "",
      institutionType: "",
      name: "",
      domain: "",
      website: "",
      adminEmail: "",
      phoneNumber: "",
      alternativePhone: "",
      logo: "",
      ownership: "",
      yearEstablished: undefined,
      shortName: "",
      motto: "",
      description: "",
      mission: "",
      vision: "",
      nucCode: "",
      nbteCode: "",
      accreditationNumber: "",
      studentPopulation: undefined,
      address: "",
    },
  });

  return {
    form,
    // We can add other shared logic here later, like mutation functions.
  };
};
