// src/app/api/auth/reset-password/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users, verificationTokens, sessions } from "@/db/schema";
import { hashPassword, isStrongPassword } from "@/lib/utils/auth";
import { eq, and, gt, like } from "drizzle-orm";
import { z } from "zod";
import { cookies } from "next/headers";

// ============================================
// VALIDATION SCHEMA
// ============================================

const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

// ============================================
// POST /api/auth/reset-password
// ============================================

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate input
    const validation = resetPasswordSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validation.error.issues },
        { status: 400 }
      );
    }

    const { token, password } = validation.data;

    // Additional password strength validation
    const passwordCheck = isStrongPassword(password);
    if (!passwordCheck.valid) {
      return NextResponse.json(
        { error: "Weak password", details: passwordCheck.errors },
        { status: 400 }
      );
    }

    // Find valid token (must have "reset:" prefix in identifier)
    const [resetToken] = await db
      .select()
      .from(verificationTokens)
      .where(
        and(
          eq(verificationTokens.token, token),
          gt(verificationTokens.expires, new Date())
        )
      )
      .limit(1);

    if (!resetToken || !resetToken.identifier.startsWith("reset:")) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 }
      );
    }

    // Extract email from identifier (remove "reset:" prefix)
    const email = resetToken.identifier.replace("reset:", "");

    // Find user
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Invalidate all existing sessions for this user
    await db
      .delete(sessions)
      .where(eq(sessions.userId, user.id));

    // Hash new password
    const hashedPassword = await hashPassword(password);

    // Update user's password
    const [updatedUser] = await db
      .update(users)
      .set({ 
        hashedPassword, 
        updatedAt: new Date() 
      })
      .where(eq(users.id, user.id))
      .returning();

    if (!updatedUser) {
      return NextResponse.json(
        { error: "Failed to update password" },
        { status: 500 }
      );
    }

    // Delete used token and all other reset tokens for this user
    await db
      .delete(verificationTokens)
      .where(like(verificationTokens.identifier, `reset:${email}`));

    return NextResponse.json(
      {
        success: true,
        message: "Password reset successfully. Please sign in.",
        redirectTo: "/auth/login?reset=true",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Password reset error:", error);
    return NextResponse.json(
      { error: "An error occurred during password reset" },
      { status: 500 }
    );
  }
}