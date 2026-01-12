// src/lib/utils/auth.ts
import { hash, verify } from "argon2";
import { generateIdFromEntropySize } from "lucia";
import { TimeSpan, createDate } from "oslo";
import { alphabet, generateRandomString } from "oslo/crypto";

// ============================================
// PASSWORD HASHING
// ============================================

export async function hashPassword(password: string): Promise<string> {
  return await hash(password, {
    memoryCost: 19456,
    timeCost: 2,
    parallelism: 1,
  });
}

export async function verifyPassword(
  hashedPassword: string,
  password: string
): Promise<boolean> {
  return await verify(hashedPassword, password);
}

// ============================================
// TOKEN GENERATION
// ============================================

export function generateVerificationToken(): string {
  return generateRandomString(32, alphabet("a-z", "A-Z", "0-9"));
}

// --- NEW FUNCTION: Generate a numeric OTP ---
/**
 * Generates a random numeric string of a given length.
 * @param length The desired length of the OTP (e.g., 6).
 * @returns A string of random digits.
 */
export function generateNumericOTP(length: number): string {
  return generateRandomString(length, alphabet("0-9"));
}

export function generateSessionToken(): string {
  return generateIdFromEntropySize(25);
}

// ============================================
// TOKEN EXPIRATION
// ============================================

// --- UPDATED FUNCTION: Allow for custom expiration times ---
/**
 * Calculates an expiration date for a token.
 * @param minutes The number of minutes from now for the token to expire. Defaults to 1440 (24 hours).
 * @returns A Date object representing the expiration time.
 */
export function getVerificationTokenExpiration(minutes: number = 1440): Date {
  if (minutes <= 0) {
    // Default to 24 hours if a non-positive number is given
    return createDate(new TimeSpan(24, "h"));
  }
  return createDate(new TimeSpan(minutes, "m"));
}

export function getPasswordResetTokenExpiration(): Date {
  return createDate(new TimeSpan(1, "h")); // 1 hour
}

// ============================================
// VALIDATION HELPERS
// ============================================

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isStrongPassword(password: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }
  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one number");
  }
  if (!/[^A-Za-z0-9]/.test(password)) {
    errors.push("Password must contain at least one special character");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// ============================================
// CSRF TOKEN (for OAuth)
// ============================================

export function generateState(): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  return generateRandomString(32, chars);
}

export function generateCodeVerifier(): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";

  return generateRandomString(128, chars);
}
