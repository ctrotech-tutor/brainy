// src/lib/utils/auth.ts
import { hash, verify } from "argon2";
import { randomBytes, randomInt } from "crypto";

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

/**
 * Generates a random string of a given length using specified characters.
 */
function generateRandomString(length: number, alphabet: string): string {
  let result = "";
  for (let i = 0; i < length; i++) {
    result += alphabet.charAt(randomInt(0, alphabet.length));
  }
  return result;
}

export function generateVerificationToken(): string {
  const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return generateRandomString(32, alphabet);
}

/**
 * Generates a random numeric string of a given length.
 * @param length The desired length of the OTP (e.g., 6).
 * @returns A string of random digits.
 */
export function generateNumericOTP(length: number): string {
  const alphabet = "0123456789";
  return generateRandomString(length, alphabet);
}

export function generateSessionToken(): string {
  return randomBytes(16).toString("hex"); // roughly 25 characters equivalent entropy
}

// ============================================
// TOKEN EXPIRATION
// ============================================

/**
 * Calculates an expiration date for a token.
 * @param minutes The number of minutes from now for the token to expire. Defaults to 1440 (24 hours).
 * @returns A Date object representing the expiration time.
 */
export function getVerificationTokenExpiration(minutes: number = 1440): Date {
  const mins = minutes > 0 ? minutes : 1440;
  return new Date(Date.now() + mins * 60 * 1000);
}

export function getPasswordResetTokenExpiration(): Date {
  return new Date(Date.now() + 60 * 60 * 1000); // 1 hour
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
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return generateRandomString(32, alphabet);
}

export function generateCodeVerifier(): string {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
  return generateRandomString(128, alphabet);
}
