
// src/app/api/auth/google/callback/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users, oauthAccounts, userRoles } from "@/db/schema";
import { lucia } from "@/lib/auth";
import { cookies } from "next/headers";
import { eq, and } from "drizzle-orm";
import { Google } from "arctic";

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error("Google OAuth credentials are not configured");
}

const REDIRECT_URI = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`;

const google = new Google(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  REDIRECT_URI
);

interface GoogleUser {
  sub: string;
  email: string;
  email_verified: boolean;
  name: string;
  picture: string;
}

// ============================================
// GET /api/auth/google/callback
// ============================================

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  console.log("[Google Auth Callback] Received callback");
  console.log("[Google Auth Callback] Code exists:", !!code);
  console.log("[Google Auth Callback] State exists:", !!state);

  const cookieStore = await cookies();
  const storedState = cookieStore.get("google_oauth_state")?.value;
  const storedCodeVerifier = cookieStore.get("google_code_verifier")?.value;
  const storedIntent = cookieStore.get("google_oauth_intent")?.value;

  console.log("[Google Auth Callback] Stored state exists:", !!storedState);
  console.log("[Google Auth Callback] Stored verifier exists:", !!storedCodeVerifier);
  console.log("[Google Auth Callback] Stored intent:", storedIntent);

  if (!code || !state || !storedState || !storedCodeVerifier || state !== storedState) {
    console.error("[Google Auth Callback] Invalid state or missing cookies");
    console.error(`[Google Auth Callback] State match: ${state === storedState}`);
    return NextResponse.redirect(
      new URL("/auth/login?error=invalid_oauth_state", process.env.NEXT_PUBLIC_APP_URL!)
    );
  }

  try {
    console.log("[Google Auth Callback] Validating authorization code");
    const tokens = await google.validateAuthorizationCode(code, storedCodeVerifier);
    console.log("[Google Auth Callback] Tokens received via validation");

    const response = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
      headers: { Authorization: `Bearer ${tokens.accessToken()}` },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[Google Auth Callback] Failed to fetch Google user info:", errorText);
      throw new Error("Failed to fetch Google user");
    }

    const googleUser: GoogleUser = await response.json();
    console.log("[Google Auth Callback] Fetched Google user info:", googleUser.email);

    const [existingOAuth] = await db
      .select()
      .from(oauthAccounts)
      .where(
        and(
          eq(oauthAccounts.providerId, "google"),
          eq(oauthAccounts.providerUserId, googleUser.sub)
        )
      )
      .limit(1);

    let userId: string;

    if (existingOAuth) {
      console.log("[Google Auth Callback] Existing OAuth account found for user:", existingOAuth.userId);
      userId = existingOAuth.userId;
    } else {
      console.log("[Google Auth Callback] No existing OAuth account found. Checking for existing email...");
      const [existingUser] = await db
        .select()
        .from(users)
        .where(eq(users.email, googleUser.email.toLowerCase()))
        .limit(1);

      if (existingUser) {
        console.log("[Google Auth Callback] Existing user found with email:", existingUser.email);
        userId = existingUser.id;

        await db.insert(oauthAccounts).values({
          providerId: "google",
          providerUserId: googleUser.sub,
          userId,
        });

        if (!existingUser.emailVerified || !existingUser.image) {
          console.log("[Google Auth Callback] Updating existing user profile (emailVerified/image)");
          await db
            .update(users)
            .set({
              emailVerified: existingUser.emailVerified ?? new Date(),
              image: existingUser.image ?? googleUser.picture,
              name: existingUser.name ?? googleUser.name,
              updatedAt: new Date(),
            })
            .where(eq(users.id, userId));
        }
      } else {
        console.log("[Google Auth Callback] Creating new user for:", googleUser.email);
        const [newUser] = await db
          .insert(users)
          .values({
            email: googleUser.email.toLowerCase(),
            emailVerified: new Date(),
            name: googleUser.name,
            image: googleUser.picture,
            onboardingIntent: storedIntent || null, 
            onboardingComplete: false,
          })
          .returning();

        userId = newUser.id;

        await db.insert(userRoles).values({
          userId,
          role: "USER",
        });

        await db.insert(oauthAccounts).values({
          providerId: "google",
          providerUserId: googleUser.sub,
          userId,
        });
      }
    }

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) {
        console.error("[Google Auth Callback] Critical: User not found after creation/lookup");
        throw new Error("User not found after OAuth");
    }

    console.log("[Google Auth Callback] Creating session for user:", userId);
    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    cookieStore.delete("google_oauth_state");
    cookieStore.delete("google_code_verifier");
    cookieStore.delete("google_oauth_intent");

    cookieStore.set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    let redirectTo: string;
    if (!user.onboardingComplete) {
      // Determine intent, preferring the stored cookie for a fresh signup flow
      // or the database value if checking an existing user.
      // Since 'user' is re-fetched from DB, user.onboardingIntent should be accurate for new users too.
      const intent = user.onboardingIntent || storedIntent;

      if (intent === "student") {
        redirectTo = "/onboarding/student/start";
      } else if (intent === "institution") {
        redirectTo = "/onboarding/institution/start";
      } else {
        redirectTo = "/onboarding/choose-path";
      }
    } else {
      redirectTo = "/dashboard";
    }

    return NextResponse.redirect(new URL(redirectTo, process.env.NEXT_PUBLIC_APP_URL!));
  } catch (error) {
    console.error("Google OAuth callback error:", error);

    const cookieStore = await cookies();
    cookieStore.delete("google_oauth_state");
    cookieStore.delete("google_code_verifier");
    cookieStore.delete("google_oauth_intent");

    return NextResponse.redirect(
      new URL("/auth/login?error=oauth_failed", process.env.NEXT_PUBLIC_APP_URL!)
    );
  }
}