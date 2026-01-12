// lib/validations/onboarding.ts
import { z } from "zod";

// --- Main schema for the student details form ---
export const studentDetailsSchema = z.object({
  institutionId: z.string().min(1, "Please select your institution."),
  
  // --- CHANGE 1: Made faculty and department required ---
  facultyId: z.string().min(1, "Please select your faculty."),
  departmentId: z.string().min(1, "Please select your department."),
  
  matricNumber: z
    .string()
    .min(3, "Matriculation number seems too short.")
    .max(30, "Matriculation number seems too long."),
    
  institutionalEmail: z
    .string()
    .email("Please enter a valid university email address.")
    // --- CHANGE 2: Added a refinement to check for common non-institutional domains ---
    .refine(
      (email) => {
        const commonPersonalDomains = [
          "gmail.com",
          "yahoo.com",
          "hotmail.com",
          "outlook.com",
          "aol.com",
          "icloud.com",
        ];
        const domain = email.split("@")[1];
        return !commonPersonalDomains.includes(domain);
      },
      {
        message: "Please use your official university email, not a personal one.",
      }
    ),
});

export type StudentDetailsInput = z.infer<typeof studentDetailsSchema>;


// --- Schema for the OTP verification form ---
export const otpSchema = z.object({
  pin: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
});

export type OtpInput = z.infer<typeof otpSchema>;

export const studentVerificationSchema = z.object({
  pin: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
  token: z.string().min(1, "Verification token is missing."),
});

export type StudentVerificationInput = z.infer<typeof studentVerificationSchema>;