// src/lib/validations/auth.ts
import { z } from "zod";

// ============================================
// PASSWORD VALIDATION
// ============================================

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character");

// ============================================
// SIGNUP SCHEMA
// ============================================

export const signupSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address")
    .toLowerCase(),
  password: passwordSchema,
  confirmPassword: z.string().min(1, "Please confirm your password"),
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters")
    .optional(),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type SignupInput = z.infer<typeof signupSchema>;

// ============================================
// LOGIN SCHEMA
// ============================================

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address")
    .toLowerCase(),
  password: z.string().min(1, "Password is required"),
});

export type LoginInput = z.infer<typeof loginSchema>;

// ============================================
// FORGOT PASSWORD SCHEMA
// ============================================

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address")
    .toLowerCase(),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

// ============================================
// RESET PASSWORD SCHEMA
// ============================================

export const resetPasswordSchema = z.object({
  password: passwordSchema,
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

// ============================================
// EMAIL VERIFICATION SCHEMA
// ============================================

export const verifyEmailSchema = z.object({
  token: z.string().min(1, "Token is required"),
});

export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;