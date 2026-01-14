// app/(onboarding)/onboarding/institution/details/_components/Step3_AdminDetails.tsx
"use client";

import { useFormContext } from "react-hook-form";
import { FullInstitutionInput } from "../_hooks/useInstitutionForm";
import { ShieldAlert, Mail } from "lucide-react";

// UI Imports
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export const Step3_AdminDetails = () => {
  const { control, watch } = useFormContext<FullInstitutionInput>();

  const institutionDomain = watch("domain");

  return (
    <div className="space-y-8 py-4">
      {/* --- UX IMPROVEMENT: High-Integrity Protocol Info --- */}
      <div className="p-5 rounded-[1.5rem] bg-primary/5 border border-primary/10 space-y-3">
        <div className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-[10px]">
          <ShieldAlert className="h-3.5 w-3.5" />
          Authorization Protocol
        </div>
        <p className="text-[10px] font-bold text-muted-foreground/60 leading-relaxed uppercase tracking-widest">
          Identity verification requires a response from an official administrative node. Personal/Social email addresses will result in protocol termination.
        </p>
      </div>

      <FormField
        control={control}
        name="adminEmail"
        render={({ field }) => (
          <FormItem className="space-y-2">
            <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 flex items-center gap-2">
              <Mail className="h-3 w-3" />
              Administrative Endpoint
            </FormLabel>
            <FormControl>
              <div className="relative">
                <Input
                  type="email"
                  {...field}
                  placeholder={institutionDomain ? `e.g. name@${institutionDomain}` : "Identity Endpoint Address..."}
                  className="h-12 px-5 rounded-xl bg-white/5 border-white/5 focus-visible:ring-primary/20 transition-all font-bold placeholder:font-medium"
                />
              </div>
            </FormControl>
            <FormMessage className="text-[10px] font-bold" />
          </FormItem>
        )}
      />
    </div>
  );
};
