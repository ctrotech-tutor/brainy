// src/app/api/auth/verify-email/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users, verificationTokens } from "@/db/schema";
import { lucia } from "@/lib/auth";
import { eq, and, gt } from "drizzle-orm";
import { z } from "zod";
import { cookies } from "next/headers";
import { generateVerificationToken, getVerificationTokenExpiration } from "@/lib/utils/auth";
import { sendVerificationEmail } from "@/lib/utils/email";

// ============================================
// VALIDATION SCHEMA
// ============================================

const verifyEmailSchema = z.object({
  token: z.string().min(1, "Token is required"),
});

// ============================================
// POST /api/auth/verify-email
// ============================================

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate input
    const validation = verifyEmailSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 400 }
      );
    }

    const { token } = validation.data;

    // Find valid token
    const [verificationToken] = await db
      .select()
      .from(verificationTokens)
      .where(
        and(
          eq(verificationTokens.token, token),
          gt(verificationTokens.expiresAt, new Date())
        )
      )
      .limit(1);

    if (!verificationToken) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 }
      );
    }

    // Find user by email (identifier in verificationTokens)
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, verificationToken.identifier))
      .limit(1);

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Update user's email verification status (set to current timestamp)
    const [updatedUser] = await db
      .update(users)
      .set({ 
        emailVerified: new Date(),
        updatedAt: new Date() 
      })
      .where(eq(users.id, user.id))
      .returning();

    if (!updatedUser) {
      return NextResponse.json(
        { error: "Failed to verify email" },
        { status: 500 }
      );
    }

    // Delete used token
    await db
      .delete(verificationTokens)
      .where(eq(verificationTokens.identifier, verificationToken.identifier));

    // Create session for the user
    const session = await lucia.createSession(updatedUser.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    return NextResponse.json(
      {
        success: true,
        message: "Email verified successfully",
        redirectTo: updatedUser.onboardingComplete ? "/dashboard" : "/onboarding",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Email verification error:", error);
    return NextResponse.json(
      { error: "An error occurred during email verification" },
      { status: 500 }
    );
  }
}

// ============================================
// POST /api/auth/verify-email/resend
// ============================================

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Find user
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()))
      .limit(1);

    if (!user) {
      // Don't reveal if user exists
      return NextResponse.json(
        { success: true, message: "If the email exists, a verification link has been sent." },
        { status: 200 }
      );
    }

    if (user.emailVerified) {
      return NextResponse.json(
        { error: "Email already verified" },
        { status: 400 }
      );
    }

    // Delete old tokens for this email
    await db
      .delete(verificationTokens)
      .where(eq(verificationTokens.identifier, user.email));

    // Generate new token
    const token = generateVerificationToken();
    const expiresAt = getVerificationTokenExpiration();

    await db.insert(verificationTokens).values({
      identifier: user.email,
      token,
      expiresAt,
    });

    // Send email
    await sendVerificationEmail(user.email, token);

    return NextResponse.json(
      { success: true, message: "Verification email sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Resend verification error:", error);
    return NextResponse.json(
      { error: "Failed to resend verification email" },
      { status: 500 }
    );
  }
}