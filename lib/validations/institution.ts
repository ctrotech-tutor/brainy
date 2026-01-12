// lib/validations/institution.ts
import { z } from "zod";

// Schema for the main institution details form
export const institutionDetailsSchema = z
  .object({
    name: z.string().min(3, "Institution name must be at least 3 characters."),
    domain: z
      .string()
      .min(3, "Please enter a valid domain.")
      .refine((domain) => domain.includes("."), {
        message: "Please enter a valid domain (e.g., harvard.edu).",
      }),
    website: z.string().optional(),
    yearEstablished: z.number().optional(),
    ownership: z.string().optional(),
    country: z.string().min(2, "Please enter a valid country name."),
    adminEmail: z.string().email("Please enter a valid email address."),
    institutionType: z.string().min(1, "Institution type is required."),
  })
  .refine(
    (data) => {
      return data.adminEmail.endsWith(`@${data.domain}`);
    },
    {
      message: "Your email must belong to the institution's domain.",
      path: ["adminEmail"],
    }
  );

export type InstitutionDetailsInput = z.infer<typeof institutionDetailsSchema>;

// Schema for the OTP verification step
export const institutionVerificationSchema = z.object({
  pin: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
  token: z.string().min(1, "Verification token is missing."),
});

export type InstitutionVerificationInput = z.infer<
  typeof institutionVerificationSchema
>;
