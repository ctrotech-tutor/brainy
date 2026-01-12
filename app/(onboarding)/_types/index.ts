// app/(onboarding)/_types/index.ts
import type { ComboboxOption } from "@/components/ui/combobox";

// --- INSTITUTION ONBOARDING ---

export type InstitutionAPIResult = ComboboxOption & {
  domain?: string;
  website?: string;
  yearEstablished?: number;
  type?: string;
};
