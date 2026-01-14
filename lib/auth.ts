import { auth } from "@/auth";
import { cache } from "react";
import { UserSession } from "@/app/(platform)/_types";

/**
 * Compatibility helper for existing Lucia-based code.
 * Returns the Auth.js session mapped to the expected shape.
 */
export const validateRequest = cache(async () => {
  const session = await auth();
  
  if (!session || !session.user) {
    return {
      user: null as UserSession | null,
      session: null,
    };
  }

  // Map Auth.js user to our UserSession type with assertion
  const user = session.user as unknown as UserSession;

  return {
    user,
    session: {
        id: session.expires,
        userId: user.id,
        expiresAt: new Date(session.expires),
        fresh: false,
    },
  };
});

/**
 * Returns the current user from the Auth.js session.
 */
export const getCurrentUser = cache(async () => {
  const session = await auth();
  return session?.user ?? null;
});

/**
 * Throws an error if the user is not authenticated.
 */
export const requireAuth = cache(async () => {
  const session = await auth();
  
  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  const user = session.user as unknown as UserSession;

  return { 
    user, 
    session: {
        id: session.expires,
        userId: user.id,
        expiresAt: new Date(session.expires),
    } 
  };
});

/**
 * Mock for middleware validation if still called from elsewhere.
 * In Auth.js v5, the middleware handles this automatically.
 */
export async function validateSessionInMiddleware(sessionId: string) {
    const session = await auth();
    if (!session || !session.user) {
        return { user: null, session: null, roles: [] };
    }
    return {
        user: session.user,
        session: { id: session.expires },
        roles: (session.user as any).roles ?? [],
    };
}
