
//lib/auth.ts
import { Lucia } from "lucia";
import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { db } from "@/db";
import { sessions, users, userRoles } from "@/db/schema";
import { cookies } from "next/headers";
import { cache } from "react";
import { eq } from "drizzle-orm";
import { Session, User } from "lucia";

// ============================================
// LUCIA ADAPTER
// ============================================

const adapter = new DrizzlePostgreSQLAdapter(db, sessions, users);

// ============================================
// LUCIA INSTANCE
// ============================================

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    name: "brainy-session",
    expires: false,
    attributes: {
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      domain: process.env.NODE_ENV === "production" ? process.env.COOKIE_DOMAIN : undefined,
    },
  },
  getUserAttributes: (attributes) => {
    return {
      id: attributes.id,
      email: attributes.email,
      emailVerified: attributes.emailVerified,
      name: attributes.name,
      image: attributes.image,
      onboardingIntent: attributes.onboardingIntent,
      onboardingComplete: attributes.onboardingComplete,
      // Note: roles is not in the users table, it's fetched separately when needed
    };
  },
});

// ============================================
// TYPE DECLARATIONS
// ============================================

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

interface DatabaseUserAttributes {
  id: string;
  email: string;
  emailVerified: Date | null;
  name: string | null;
  image: string | null;
  onboardingIntent: "student" | "institution" | "tutor" | null;
  onboardingComplete: boolean;
}

// ============================================
// SESSION VALIDATION (Server-Side)
// ============================================

export const validateRequest = cache(async () => {
  const cookieStore = await cookies();
 const sessionId =
  cookieStore.get(lucia.sessionCookieName)?.value ?? null;


  if (!sessionId) {
    return {
      user: null,
      session: null,
    };
  }

  const result = await lucia.validateSession(sessionId);

  try {
    if (result.session && result.session.fresh) {
      const sessionCookie = lucia.createSessionCookie(result.session.id);
      cookieStore.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    }
    if (!result.session) {
      const sessionCookie = lucia.createBlankSessionCookie();
      cookieStore.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    }
  } catch {
    // Next.js throws when attempting to set cookies during rendering
  }

  return result;
});

// ============================================
// MIDDLEWARE SESSION VALIDATION
// ============================================

/**
 * Validates a session ID directly. Fast and safe for use in Middleware.
 */
export async function validateSessionInMiddleware(sessionId: string): Promise<{
  user: User | null;
  session: Session | null;
  roles: string[];
}> {
  if (!sessionId) {
    return { user: null, session: null, roles: [] };
  }

  try {
    const { user, session } = await lucia.validateSession(sessionId);
    
    if (!user || !session) {
      return { user: null, session: null, roles: [] };
    }

    // Fetch roles manually since they are in a separate table
    const dbRoles = await db
      .select({ role: userRoles.role })
      .from(userRoles)
      .where(eq(userRoles.userId, user.id));

    return {
      user,
      session,
      roles: dbRoles.map(r => r.role),
    };
  } catch (error) {
    console.error("[Auth Middleware] Validation error:", error);
    return { user: null, session: null, roles: [] };
  }
}


// ============================================
// GET CURRENT USER
// ============================================

export const getCurrentUser = cache(async () => {
  const { user } = await validateRequest();
  return user;
});

// ============================================
// REQUIRE AUTH (throws if not authenticated)
// ============================================

export const requireAuth = cache(async () => {
  const { user, session } = await validateRequest();
  
  if (!user || !session) {
    throw new Error("Unauthorized");
  }

  return { user, session };
});