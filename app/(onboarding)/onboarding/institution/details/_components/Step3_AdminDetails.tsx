// app/(onboarding)/onboarding/institution/details/_components/Step3_AdminDetails.tsx
"use client";

import { useFormContext } from "react-hook-form";
import { FullInstitutionInput } from "../_hooks/useInstitutionForm";
import { Info } from "lucide-react";

// UI Imports
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const Step3_AdminDetails = () => {
  const { control, watch } = useFormContext<FullInstitutionInput>();

  // Watch the domain from Step 2 to provide helpful context
  const institutionDomain = watch("domain");

  return (
    <div className="space-y-6">
      {/* --- UX IMPROVEMENT: Contextual Alert --- */}
      {/* This alert provides critical context and reinforces the rules. */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Important: Use Your Official Email</AlertTitle>
        <AlertDescription>
          A verification code will be sent to this address. You must have access to it to prove you are an authorized representative of the institution.
        </AlertDescription>
      </Alert>

      <FormField
        control={control}
        name="adminEmail"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Your Official Administrator Email</FormLabel>
            <FormControl>
              <Input 
                type="email" 
                {...field} 
                placeholder={institutionDomain ? `e.g., your.name@${institutionDomain}` : "e.g., admin@your-institution.com"}
              />
            </FormControl>
            <FormDescription>
              This email must match the institution&apos;s domain. Personal emails (e.g., Gmail, Yahoo) will be rejected.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
