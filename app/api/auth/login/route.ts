// src/app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { verifyPassword } from "@/lib/utils/auth";
import { lucia } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { setCookie } from "@/lib/cookie";
import { ApiResponses } from "@/lib/api-response";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();



    const validation = loginSchema.safeParse(body);
    if (!validation.success) {
      return ApiResponses.validationError(validation.error.issues);
    }

    const { email, password } = validation.data;

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()))
      .limit(1);

    if (!user || !user.hashedPassword) {
      return ApiResponses.error("Invalid email or password", 401);
    }

    const isValidPassword = await verifyPassword(user.hashedPassword, password);
    if (!isValidPassword) {
      return ApiResponses.error("Invalid email or password", 401);
    }

    if (!user.emailVerified) {
      return ApiResponses.error("Email not verified", 403, {
          code: "EMAIL_NOT_VERIFIED",
          message: "Please verify your email before logging in.",
          email: user.email,
        });
    }

    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    // --- CHANGE 2: Use your setCookie helper for consistency ---
    await setCookie(sessionCookie);

    // --- CHANGE 3: Make the redirect logic more specific ---
    let redirectTo: string;
    if (!user.onboardingComplete) {
      // If onboarding is not complete, determine the specific path
      const intent = user.onboardingIntent;
      if (intent === "student") {
        redirectTo = "/onboarding/student/start";
      } else if (intent === "institution") {
        redirectTo = "/onboarding/institution/start";
      } else {
        // Fallback if intent is missing for some reason
        redirectTo = "/onboarding/choose-path";
      }
    } else {
      // If onboarding is complete, send to the main dashboard
      redirectTo = "/dashboard";
    }

    return ApiResponses.success({
        success: true,
        message: "Login successful",
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          emailVerified: !!user.emailVerified,
          onboardingComplete: user.onboardingComplete,
        },
        redirectTo,
      });

  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "An error occurred during login. Please try again." },
      { status: 500 }
    );
  }
}
