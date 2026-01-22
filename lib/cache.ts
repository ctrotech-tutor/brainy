import { redis } from "@/lib/redis";

const DEFAULT_TTL = 60 * 5; // 5 minutes default TTL

export const Cache = {
    /**
     * store a value in the cache
     * @param key - The cache key
     * @param value - The data to store (will be JSON stringified automatically by Upstash/Redis)
     * @param ttlSeconds - Time to live in seconds (default: 5 minutes)
     */
    async set(key: string, value: any, ttlSeconds: number = DEFAULT_TTL): Promise<void> {
        if (!redis) return;
        try {
            await redis.set(key, value, { ex: ttlSeconds });
        } catch (error) {
            console.warn(`[Cache] Failed to set key "${key}":`, error);
            // We don't throw here to ensure the app keeps working even if cache fails
        }
    },

    /**
     * Retrieve a value from the cache
     * @param key - The cache key
     * @returns The parsed value or null if not found/error
     */
    async get<T>(key: string): Promise<T | null> {
        if (!redis) return null;
        try {
            const data = await redis.get<T>(key);
            return data;
        } catch (error) {
            console.warn(`[Cache] Failed to get key "${key}":`, error);
            return null;
        }
    },

    /**
     * Delete a value from the cache
     * @param key - The cache key
     */
    async del(key: string): Promise<void> {
        if (!redis) return;
        try {
            await redis.del(key);
        } catch (error) {
            console.warn(`[Cache] Failed to delete key "${key}":`, error);
        }
    },

    /**
     * Generate a standardized cache key
     * @param prefix - Feature prefix (e.g., 'stats', 'inst')
     * @param parts - Unique identifiers derived from query params
     */
    key(prefix: string, ...parts: (string | number | undefined)[]): string {
        return `brainy:${prefix}:${parts.filter(p => p !== undefined).join(":")}`;
    }
};
