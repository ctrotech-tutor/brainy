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
        message: "Please enter a valid domain (e.g., mail.ui.edu.ng).",
      }),
    website: z.string().optional(),
    yearEstablished: z.number().optional(),
    ownership: z.string().optional(),
    country: z.string().min(1, "Country is required."),
    state: z.string().min(1, "State is required."),
    lga: z.string().min(1, "LGA is required."),
    adminEmail: z.string().email("Please enter a valid email address."),
    phoneNumber: z.string().min(10, "Please enter a valid Nigerian phone number."),
    institutionType: z.string().min(1, "Institution type is required."),
    // Institutional Identity
    shortName: z.string().optional(),
    motto: z.string().optional(),
    description: z.string().min(20, "Please provide a brief description (min 20 chars).").optional().or(z.literal("")),
    mission: z.string().optional(),
    vision: z.string().optional(),

    // Academic & Identification
    nucCode: z.string().optional(),
    nbteCode: z.string().optional(),
    accreditationNumber: z.string().optional(),
    studentPopulation: z.enum([
      "LESS_THAN_1000",
      "1000-5000",
      "5000-10000",
      "10000-20000",
      "20000-50000",
      "MORE_THAN_50000",
    ]).optional(),

    // Location & Contact
    address: z.string().min(5, "Full physical address is required."),
    alternativePhone: z.string().optional(),

    logo: z.string().optional(), // Cloudinary URL
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
