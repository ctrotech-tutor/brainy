// src/app/api/auth/google/route.ts
import { NextRequest, NextResponse } from "next/server";
import { generateState, generateCodeVerifier } from "@/lib/utils/auth";
import { cookies } from "next/headers";
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

// ============================================
// GET /api/auth/google
// ============================================

export async function GET(req: NextRequest) {
  try {
    const state = generateState();
    const codeVerifier = generateCodeVerifier();

    console.log("[Google Auth] Initializing OAuth flow");
    console.log("[Google Auth] Generated state:", state);

    const url = await google.createAuthorizationURL(
      state,
      codeVerifier,
      ["profile", "email"]
    );

    console.log("[Google Auth] Authorization URL created:", url.toString());

    const cookieStore = await cookies();

    console.log("[Google Auth] Setting google_oauth_state cookie");
    cookieStore.set("google_oauth_state", state, {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 10,
      sameSite: "lax",
    });

    console.log("[Google Auth] Setting google_code_verifier cookie");
    cookieStore.set("google_code_verifier", codeVerifier, {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 10,
      sameSite: "lax",
    });

    const intent = req.nextUrl.searchParams.get("intent");
    if (intent) {
      console.log("[Google Auth] Storing onboarding intent:", intent);
      cookieStore.set("google_oauth_intent", intent, {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 10,
        sameSite: "lax",
      });
    }

    return NextResponse.redirect(url);
  } catch (error) {
    console.error("Google OAuth redirect error:", error);
    return NextResponse.redirect(
      new URL("/auth/login?error=oauth_failed", process.env.NEXT_PUBLIC_APP_URL!)
    );
  }
}
