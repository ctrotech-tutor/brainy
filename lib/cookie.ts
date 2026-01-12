// src/lib/cookie.ts
import { cookies } from "next/headers";
import type { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";

/**
 * Async wrapper to get the Next.js cookie store.
 * Use this everywhere instead of calling `cookies()` directly.
 */
export const getCookieStore = async () => {
  return cookies();
};

/**
 * Helper to get a specific cookie by name
 */
export const getCookieValue = async (name: string): Promise<string | null> => {
  const cookieStore = await getCookieStore();
  const cookie = cookieStore.get(name);
  return cookie?.value ?? null;
};

/**
 * Helper to set a cookie.
 * It correctly awaits the cookie store and accepts a cookie object.
 */
export const setCookie = async (
  cookie: ResponseCookie
): Promise<void> => {
  const cookieStore = await getCookieStore();
  cookieStore.set(cookie);
};
