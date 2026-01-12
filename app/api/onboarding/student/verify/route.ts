// src/app/api/onboarding/student/verify/route.ts
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { db } from "@/db";
import { users, userRoles, verificationTokens, studentProfiles } from "@/db/schema";
import { eq, and, gt } from "drizzle-orm";
import { generateNumericOTP, getVerificationTokenExpiration } from "@/lib/utils/auth";
import { sendStudentVerificationOTP } from "@/lib/utils/email";
import { studentVerificationSchema } from "@/lib/validations/onboarding";
import { z } from "zod";

// ============================================
// POST /api/onboarding/student/verify - Verify OTP and complete student onboarding
// ============================================
export async function POST(req: NextRequest) {
  try {
    const { user } = await requireAuth();
    const body = await req.json();

    // Validate the incoming request body for both OTP and token
    const validation = studentVerificationSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: "Invalid request format", details: validation.error.issues }, { status: 400 });
    }
    const { pin: otp, token } = validation.data;

    // --- SECURITY CHECK: Use the secure "ticket" token as the identifier ---
    const identifier = token;
    const [otpRecord] = await db.select().from(verificationTokens).where(
      and(
        eq(verificationTokens.identifier, identifier),
        eq(verificationTokens.token, otp), // Check if the OTP matches
        gt(verificationTokens.expiresAt, new Date()) // Check if it's not expired
      )
    ).limit(1);

    // If no record is found, the token/OTP pair is invalid or expired.
    if (!otpRecord) {
      return NextResponse.json({ error: "Invalid or expired verification code." }, { status: 400 });
    }

    // --- CORE LOGIC: Now that the token is verified, we can proceed ---

    // 1. Mark the student profile as verified
    await db.update(studentProfiles)
      .set({ verifiedAt: new Date() })
      .where(eq(studentProfiles.userId, user.id));

    // 2. Assign the STUDENT role (if it doesn't exist)
    await db.insert(userRoles).values({ userId: user.id, role: "STUDENT" }).onConflictDoNothing();

    // 3. Mark the user's general onboarding as complete
    await db.update(users)
      .set({ onboardingComplete: true, updatedAt: new Date() })
      .where(eq(users.id, user.id));

    // 4. Clean up by deleting the used verification token
    await db.delete(verificationTokens).where(eq(verificationTokens.identifier, identifier));

    return NextResponse.json({
      success: true,
      message: "Student verification successful! Redirecting...",
      redirectTo: "/dashboard/student",
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Student verification error:", error);
    return NextResponse.json({ error: "Failed to verify student." }, { status: 500 });
  }
}

// ============================================
// PUT /api/onboarding/student/verify - Resend OTP
// ============================================

const resendSchema = z.object({
  token: z.string().min(1, "Token is required for resending OTP"),
});

export async function PUT(req: NextRequest) {
  try {
    const { user } = await requireAuth();
    const body = await req.json();

    const validation = resendSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: "Invalid request format", details: validation.error.issues }, { status: 400 });
    }
    const { token } = validation.data;

    const profile = await db.query.studentProfiles.findFirst({
      where: eq(studentProfiles.userId, user.id),
      with: { institution: true },
    });

    if (!profile || !profile.institutionalEmail || !profile.institution) {
      return NextResponse.json({ error: "No pending student registration found to resend code." }, { status: 400 });
    }

    const otp = generateNumericOTP(6);
    const expiresAt = getVerificationTokenExpiration(15);
    
    // Use the provided "ticket" token as the identifier
    const identifier = token;

    // Delete old OTPs for this identifier (ticket) and store the new one
    await db.delete(verificationTokens).where(eq(verificationTokens.identifier, identifier));
    await db.insert(verificationTokens).values({ identifier, token: otp, expiresAt });

    // Send the new OTP email
    await sendStudentVerificationOTP(profile.institutionalEmail, otp, profile.institution.name);

    return NextResponse.json({ success: true, message: "A new verification code has been sent." });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Resend OTP error:", error);
    return NextResponse.json({ error: "Failed to resend verification code." }, { status: 500 });
  }
}
