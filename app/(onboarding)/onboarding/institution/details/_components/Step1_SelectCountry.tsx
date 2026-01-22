// app/(onboarding)/onboarding/institution/details/_components/Step1_SelectCountry.tsx
"use client";

import { useFormContext } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { FullInstitutionInput } from "../_hooks/useInstitutionForm";
import { MapPin, Building2, Navigation } from "lucide-react";
import { NIGERIAN_STATES } from "@/lib/data/nigeria";
import { Input } from "@/components/ui/input";

// UI Imports
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const institutionTypes = [
  "FEDERAL_UNIVERSITY", "STATE_UNIVERSITY", "PRIVATE_UNIVERSITY", "POLYTECHNIC", "COLLEGE_OF_EDUCATION",
  "TECHNICAL_COLLEGE", "SECONDARY_SCHOOL", "TRAINING_ACADEMY", "RESEARCH_INSTITUTE", "ONLINE_UNIVERSITY", "OTHER",
];

export const Step1_SelectCountry = () => {
  const { control } = useFormContext<FullInstitutionInput>();

  return (
    <div className="space-y-6 py-4">
      {/* State Selection */}
      <FormField
        control={control}
        name="state"
        render={({ field }) => (
          <FormItem className="space-y-2">
            <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 flex items-center gap-2">
              <MapPin className="h-3 w-3" />
              State Jurisdiction
            </FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="h-12 rounded-xl bg-white/5 border-white/10 focus:ring-primary/20 backdrop-blur-md transition-all">
                  <SelectValue placeholder="Select State..." />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="bg-black/90 backdrop-blur-xl border-white/10 h-[300px]">
                {NIGERIAN_STATES.map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage className="text-[10px] font-bold" />
          </FormItem>
        )}
      />

      {/* LGA Input */}
      <FormField
        control={control}
        name="lga"
        render={({ field }) => (
          <FormItem className="space-y-2">
            <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 flex items-center gap-2">
              <Navigation className="h-3 w-3" />
              Local Gov. Area
            </FormLabel>
            <FormControl>
              <Input
                {...field}
                placeholder="Enter LGA..."
                className="h-12 px-5 rounded-xl bg-white/5 border-white/10 focus-visible:ring-primary/20 transition-all font-bold placeholder:font-medium"
              />
            </FormControl>
            <FormMessage className="text-[10px] font-bold" />
          </FormItem>
        )}
      />

      {/* Institution Type */}
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
                <SelectTrigger className="h-12 rounded-xl bg-white/5 border-white/10 focus:ring-primary/20 backdrop-blur-md transition-all">
                  <SelectValue placeholder="Define Entity Type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="bg-black/90 backdrop-blur-xl border-white/10">
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
    </div>
  );
};
