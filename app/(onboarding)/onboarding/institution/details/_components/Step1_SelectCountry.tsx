// app/(onboarding)/onboarding/institution/details/_components/Step1_SelectCountry.tsx
"use client";

import { useFormContext } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FullInstitutionInput } from "../_hooks/useInstitutionForm";
import { Globe, Building2 } from "lucide-react";

// UI Imports
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Combobox, type ComboboxOption } from "@/components/ui/combobox";
import { Skeleton } from "@/components/ui/skeleton";

const institutionTypes = [
  "FEDERAL_UNIVERSITY", "STATE_UNIVERSITY", "PRIVATE_UNIVERSITY", "POLYTECHNIC", "COLLEGE_OF_EDUCATION",
  "TECHNICAL_COLLEGE", "SECONDARY_SCHOOL", "TRAINING_ACADEMY", "RESEARCH_INSTITUTE", "ONLINE_UNIVERSITY", "OTHER",
];

const fetchCountries = async (): Promise<ComboboxOption[]> => {
  const { data } = await axios.get<ComboboxOption[]>("/api/countries");
  return data;
};

export const Step1_SelectCountry = () => {
  const { control, watch } = useFormContext<FullInstitutionInput>();

  const { data: countries, isPending: isLoadingCountries, isError } = useQuery({
    queryKey: ["countries"],
    queryFn: fetchCountries,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
  });

  const selectedCountry = watch("country");

  return (
    <div className="space-y-8 py-4">
      <FormField
        control={control}
        name="country"
        render={({ field }) => (
          <FormItem className="space-y-2">
            <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 flex items-center gap-2">
              <Globe className="h-3 w-3" />
              Jurisdiction Node
            </FormLabel>
            {isLoadingCountries ? (
              <Skeleton className="h-12 w-full rounded-xl bg-white/5" />
            ) : (
              <Combobox
                options={Array.isArray(countries) ? countries : []}
                value={field.value}
                onChange={field.onChange}
                placeholder="Select Region"
                searchPlaceholder="Search Protocol Regions..."
                notFoundMessage={isError ? "Transmission Failure." : "Entry Not Cataloged."}
                disabled={isError}
                className="h-12 bg-white/5 border-white/10 rounded-xl transition-all focus:ring-primary/20"
              />
            )}
            <FormMessage className="text-[10px] font-bold" />
          </FormItem>
        )}
      />

      <AnimatePresence>
        {selectedCountry && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          >
            <FormField
              control={control}
              name="institutionType"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 flex items-center gap-2">
                    <Building2 className="h-3 w-3" />
                    Classification Type
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-12 rounded-xl bg-white/5 border-white/5 focus:ring-primary/20 backdrop-blur-md transition-all">
                        <SelectValue placeholder="Define Entity Type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-card/95 backdrop-blur-xl border-white/5">
                      {institutionTypes.map(type => (
                        <SelectItem key={type} value={type}>
                          {type.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-[10px] font-bold" />
                </FormItem>
              )}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
