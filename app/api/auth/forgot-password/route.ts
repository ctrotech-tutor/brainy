// src/app/api/auth/forgot-password/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users, verificationTokens } from "@/db/schema";
import { generateVerificationToken, getPasswordResetTokenExpiration } from "@/lib/utils/auth";
import { sendPasswordResetEmail } from "@/lib/utils/email";
import { eq, } from "drizzle-orm";
import { z } from "zod";

// ============================================
// VALIDATION SCHEMA
// ============================================

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

// ============================================
// POST /api/auth/forgot-password
// ============================================

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate input
    const validation = forgotPasswordSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    const { email } = validation.data;

    // Find user
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()))
      .limit(1);

    // Always return success to prevent email enumeration
    if (!user) {
      return NextResponse.json(
        { 
          success: true, 
          message: "If an account exists with this email, you will receive a password reset link." 
        },
        { status: 200 }
      );
    }

    // Check if user has a password (not OAuth-only)
    if (!user.hashedPassword) {
      return NextResponse.json(
        { 
          success: true, 
          message: "If an account exists with this email, you will receive a password reset link." 
        },
        { status: 200 }
      );
    }

    // Delete old reset tokens for this email
    // We'll use identifier format: "reset:{email}" to distinguish from verification tokens
    const resetIdentifier = `reset:${user.email}`;
    await db
      .delete(verificationTokens)
      .where(eq(verificationTokens.identifier, resetIdentifier));

    // Generate new token
    const token = generateVerificationToken();
    const expires = getPasswordResetTokenExpiration();

    await db.insert(verificationTokens).values({
      identifier: resetIdentifier,
      token,
      expires,
    });

    // Send password reset email
    try {
      await sendPasswordResetEmail(user.email, token);
    } catch (emailError) {
      console.error("Failed to send password reset email:", emailError);
      return NextResponse.json(
        { error: "Failed to send password reset email. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        message: "If an account exists with this email, you will receive a password reset link." 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "An error occurred. Please try again." },
      { status: 500 }
    );
  }
}