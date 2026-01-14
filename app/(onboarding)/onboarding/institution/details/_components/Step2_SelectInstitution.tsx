// app/(onboarding)/onboarding/institution/details/_components/Step2_SelectInstitution.tsx
"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FullInstitutionInput } from "../_hooks/useInstitutionForm";
import { Search, Globe, Link, Building } from "lucide-react";

// UI Imports
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Combobox } from "@/components/ui/combobox";
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
    <div className="text-center p-6 space-y-3 bg-white/2 rounded-[1.5rem] border border-white/5 mx-2 my-2">
      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Registry mismatch?</p>
      <Button
        variant="outline"
        size="sm"
        type="button"
        className="h-10 px-6 rounded-xl border-white/10 bg-white/5 font-black uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all"
        onClick={() => setIsManualEntry(true)}
      >
        Manual Catalog Entry
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
    <div className="space-y-8 py-4">
      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem className="space-y-2">
            <div className="flex justify-between items-center">
              <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 flex items-center gap-2">
                <Building className="h-3 w-3" />
                Legal Identifier
              </FormLabel>
              {isManualEntry && (
                <button
                  type="button"
                  className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary/80 transition-colors flex items-center gap-1.5"
                  onClick={handleReturnToSearch}
                >
                  <Search className="h-3 w-3" />
                  Search Catalog
                </button>
              )}
            </div>
            <AnimatePresence mode="wait">
              {isManualEntry ? (
                <motion.div
                  key="manual-input"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                >
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter Legal Entity Name..."
                      className="h-12 px-5 rounded-xl bg-white/5 border-white/5 focus-visible:ring-primary/20 transition-all font-bold placeholder:font-medium"
                    />
                  </FormControl>
                </motion.div>
              ) : (
                <motion.div
                  key="combobox-search"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {isLoading ? (
                    <Skeleton className="h-12 w-full rounded-xl bg-white/5" />
                  ) : (
                    <Combobox
                      options={Array.isArray(institutionOptions) ? institutionOptions : []}
                      value={field.value}
                      onChange={(value) => {
                        field.onChange(value);
                        handleSelectInstitution(value);
                      }}
                      placeholder="Identify Institution..."
                      searchPlaceholder="Search Registry Database..."
                      disabled={!selectedCountry || isLoading}
                      renderNotFound={renderManualEntryToggle()}
                      className="h-12 bg-white/5 border-white/10 rounded-xl transition-all focus:ring-primary/20"
                    />
                  )}
                </motion.div>
              )}
            </AnimatePresence>
            <FormMessage className="text-[10px] font-bold" />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <FormField
          control={control}
          name="domain"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 flex items-center gap-2">
                <Globe className="h-3 w-3" />
                Root Domain
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    placeholder="e.g. mit.edu"
                    disabled={!isManualEntry && !!field.value}
                    className="h-12 px-5 rounded-xl bg-white/5 border-white/5 focus-visible:ring-primary/20 transition-all font-bold placeholder:font-medium disabled:opacity-60"
                  />
                </div>
              </FormControl>
              <FormMessage className="text-[10px] font-bold" />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="website"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 flex items-center gap-2">
                <Link className="h-3 w-3" />
                Online Presence
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="https://institutional.edu"
                  disabled={!isManualEntry && !!field.value}
                  className="h-12 px-5 rounded-xl bg-white/5 border-white/5 focus-visible:ring-primary/20 transition-all font-bold placeholder:font-medium disabled:opacity-60"
                />
              </FormControl>
              <FormMessage className="text-[10px] font-bold" />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
