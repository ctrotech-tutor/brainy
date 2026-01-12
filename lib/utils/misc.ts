// lib/utils/misc.ts

/**
 * Generates a simple, short, and unique ID.
 * Useful for component instance keys to prevent re-renders.
 */
export const generateComponentId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};
