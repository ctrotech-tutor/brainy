"use client";

import { useFormContext } from "react-hook-form";
import { FullInstitutionInput } from "../_hooks/useInstitutionForm";
import { Mail, Phone, MapPin, Contact2, ShieldAlert } from "lucide-react";

// UI Imports
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export const Step5_AccessContact = () => {
  const { control, watch } = useFormContext<FullInstitutionInput>();
  const institutionDomain = watch("domain");

  return (
    <div className="space-y-6 py-4">
      {/* Protocol Alert */}
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
              <Input
                type="email"
                {...field}
                placeholder={institutionDomain ? `registry@${institutionDomain}` : "Identity Endpoint Address..."}
                className="h-12 px-5 rounded-xl bg-white/5 border-white/10 focus-visible:ring-primary/20 transition-all font-bold placeholder:font-medium"
              />
            </FormControl>
            <FormMessage className="text-[10px] font-bold" />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <FormField
          control={control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 flex items-center gap-2">
                <Phone className="h-3 w-3" />
                Primary Comms
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="+234..."
                  className="h-12 px-5 rounded-xl bg-white/5 border-white/10 focus-visible:ring-primary/20 transition-all font-bold placeholder:font-medium"
                />
              </FormControl>
              <FormMessage className="text-[10px] font-bold" />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="alternativePhone"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 flex items-center gap-2">
                <Contact2 className="h-3 w-3" />
                Alternate Comms
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="+234... (Optional)"
                  className="h-12 px-5 rounded-xl bg-white/5 border-white/10 focus-visible:ring-primary/20 transition-all font-bold placeholder:font-medium"
                />
              </FormControl>
              <FormMessage className="text-[10px] font-bold" />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
        name="address"
        render={({ field }) => (
          <FormItem className="space-y-2">
            <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 flex items-center gap-2">
              <MapPin className="h-3 w-3" />
              Physical Infrastructure Node
            </FormLabel>
            <FormControl>
              <Input
                {...field}
                placeholder="Full Street Address, Campus Location..."
                className="h-12 px-5 rounded-xl bg-white/5 border-white/10 focus-visible:ring-primary/20 transition-all font-bold placeholder:font-medium"
              />
            </FormControl>
            <FormMessage className="text-[10px] font-bold" />
          </FormItem>
        )}
      />
    </div>
  );
};
