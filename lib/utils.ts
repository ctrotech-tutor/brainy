// lib/utils.ts
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { AxiosError } from "axios";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Generates an acronym from a full name, replicating the Go logic.
 * Example: "Ahmadu Bello University, Zaria" -> "ABUZ"
 */
export function generateAbbreviation(name: string): string {
  if (!name) return "";
  const words = name.split(/[\s,()]+/);
  return words
    .map(word => {
      const match = word.match(/[a-zA-Z]/);
      return match ? match[0] : "";
    })
    .join("").toUpperCase();
}

/**
 * Generates initials from a full name.
 * Example: "John Doe" -> "JD", "John" -> "JO"
 */
export function getInitials(name: string | null | undefined): string {
  if (!name) return "??";
  const names = name.split(" ");
  return names.length > 1
    ? `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
    : name.substring(0, 2).toUpperCase();
}

/**
 * Formats a date string or object into a human-readable string.
 * Uses 'en-US' locale by default but can be customized.
 */
export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Safely extracts an error message from an unknown error object.
 * Handles Axios errors, Error objects, and strings.
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    return error.response?.data?.error || error.message || "An unexpected error occurred.";
  }
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "string") {
    return error;
  }
  return "An unknown error occurred.";
}

export function formatBytes(
  bytes: number,
  decimals: number = 2
): string {
  if (!bytes || bytes === 0) return "0 B";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["B", "KB", "MB", "GB", "TB", "PB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

