// app/(onboarding)/onboarding/institution/details/_components/Step2_SelectInstitution.tsx
"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FullInstitutionInput } from "../_hooks/useInstitutionForm";
import { Search } from "lucide-react";

// UI Imports
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Combobox, type ComboboxOption } from "@/components/ui/combobox";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { InstitutionAPIResult } from "@/app/(onboarding)/_types";

// API fetching functions for each source
const fetchNigerianInstitutions = async (): Promise<InstitutionAPIResult[]> => {
  const { data } = await axios.get("/api/institutions/nigeria");
  return data;
};

const fetchGlobalInstitutions = async (country: string): Promise<InstitutionAPIResult[]> => {
  const { data } = await axios.get(`/api/institutions/global?country=${country}`);
  return data;
};

export const Step2_SelectInstitution = () => {
  const { control, watch, setValue, resetField } = useFormContext<FullInstitutionInput>();
  const [isManualEntry, setIsManualEntry] = useState(false);

  const selectedCountry = watch("country");
  const isNigeria = selectedCountry?.toLowerCase() === "nigeria";

  // Query for Nigerian institutions (pre-fetched list)
  const { data: nigerianInstitutions, isPending: isLoadingNigerian } = useQuery({
    queryKey: ["nigerianInstitutions"],
    queryFn: fetchNigerianInstitutions,
    enabled: isNigeria,
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60, // 1 hours
  });

  // Query for Global institutions (pre-fetched list)
  const { data: globalInstitutions, isPending: isLoadingGlobal } = useQuery({
    queryKey: ["globalInstitutions", selectedCountry],
    queryFn: () => fetchGlobalInstitutions(selectedCountry),
    enabled: !!selectedCountry && !isNigeria,
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  const institutionOptions = isNigeria ? nigerianInstitutions : globalInstitutions;
  const isLoading = isLoadingNigerian || isLoadingGlobal;

  const handleSelectInstitution = (value: string) => {
    const selected = institutionOptions?.find(opt => opt.value === value);
    if (selected) {
      setValue("name", selected.label, { shouldValidate: true });
      setValue("domain", selected.domain || "", { shouldValidate: true });
      setValue("website", selected.website || "", { shouldValidate: true });
      if (selected.yearEstablished) setValue("yearEstablished", selected.yearEstablished, { shouldValidate: true });
      if (isNigeria && selected.type) setValue("ownership", selected.type.toUpperCase() as FullInstitutionInput['ownership']);
    }
  };

  const renderManualEntryToggle = () => (
    <div className="text-center p-4">
      <p className="text-sm text-muted-foreground mb-2">Institution not found.</p>
      <Button variant="link" size="sm" type="button" className="h-auto p-0" onClick={() => setIsManualEntry(true)}>
        Click here to enter it manually.
      </Button>
    </div>
  );

  const handleReturnToSearch = () => {
    resetField("name");
    resetField("domain");
    resetField("website");
    setIsManualEntry(false);
  };

  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <div className="flex justify-between items-center">
              <FormLabel>Official Institution Name</FormLabel>
              {isManualEntry && (
                <Button variant="link" size="sm" type="button" className="h-auto p-0 text-xs" onClick={handleReturnToSearch}>
                  <Search className="mr-1 h-3 w-3" />
                  Return to search
                </Button>
              )}
            </div>
            <AnimatePresence mode="wait">
              {isManualEntry ? (
                <motion.div key="manual-input" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <FormControl>
                    <Input {...field} placeholder="Enter institution name manually..." />
                  </FormControl>
                </motion.div>
              ) : (
                <motion.div key="combobox-search" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  {isLoading ? (
                    <Skeleton className="h-10 w-full" />
                  ) : (
                    <Combobox
                      options={Array.isArray(institutionOptions) ? institutionOptions : []}
                      value={field.value}
                      onChange={(value) => {
                        field.onChange(value);
                        handleSelectInstitution(value);
                      }}
                      placeholder="Select an institution..."
                      searchPlaceholder="Search for an institution..."
                      disabled={!selectedCountry || isLoading}
                      renderNotFound={renderManualEntryToggle()}
                    />
                  )}
                </motion.div>
              )}
            </AnimatePresence>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="domain"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Institution Domain</FormLabel>
              <FormControl><Input {...field} placeholder="e.g., unilag.edu.ng" disabled={!isManualEntry && !!field.value} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="website"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Website</FormLabel>
              <FormControl><Input {...field} placeholder="https://unilag.edu.ng" disabled={!isManualEntry && !!field.value} /></FormControl>
              <FormMessage />
            </FormItem>
           )}
        />
      </div>
    </div>
  );
};
