// app/(onboarding)/onboarding/institution/details/_components/Step1_SelectCountry.tsx
"use client";

import { useFormContext } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FullInstitutionInput } from "../_hooks/useInstitutionForm";

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

  // --- FIXES APPLIED HERE ---
  const { data: countries, isPending: isLoadingCountries, isError } = useQuery({
    queryKey: ["countries"],
    queryFn: fetchCountries,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
  });

  const selectedCountry = watch("country");

  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="country"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Country of Institution</FormLabel>
            {isLoadingCountries ? (
              <Skeleton className="h-10 w-full" />
            ) : (
              // FIX 2: Ensure `countries` is an array before passing to `options`
              <Combobox
                options={Array.isArray(countries) ? countries : []}
                value={field.value}
                onChange={field.onChange}
                placeholder="Select a country..."
                searchPlaceholder="Search for a country..."
                notFoundMessage={isError ? "Failed to load countries." : "No country found."}
                disabled={isError}
              />
            )}
            <FormMessage />
          </FormItem>
        )}
      />

      <AnimatePresence>
        {selectedCountry && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <FormField
              control={control}
              name="institutionType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Institution Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select the type of institution" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {institutionTypes.map(type => (
                        <SelectItem key={type} value={type}>
                          {type.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
