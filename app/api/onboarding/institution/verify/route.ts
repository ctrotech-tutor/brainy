// src/app/api/onboarding/institution/verify/route.ts
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { db } from "@/db";
import { institutions, userRoles, users, verificationTokens } from "@/db/schema";
import { eq, and, gt } from "drizzle-orm";
import { generateNumericOTP, getVerificationTokenExpiration } from "@/lib/utils/auth";
import { sendInstitutionVerificationEmail } from "@/lib/utils/email";
import { z } from "zod";
import { ApiResponses } from "@/lib/api-response";

// --- CHANGE 1: Import our final, correct validation schema ---
import { institutionVerificationSchema } from "@/lib/validations/institution";

// ============================================
// POST /api/onboarding/institution/verify - Verify OTP and submit for review
// ============================================
export async function POST(req: NextRequest) {
  try {
    const { user } = await requireAuth();
    const body = await req.json();

    // --- CHANGE 2: Use the correct schema for validation ---
    const validation = institutionVerificationSchema.safeParse(body);
    if (!validation.success) {
      return ApiResponses.validationError(validation.error.issues);
    }
    const { pin: otp, token } = validation.data;

    // --- CHANGE 3: Use the secure "ticket" token as the identifier ---
    const identifier = token;
    const [otpRecord] = await db.select().from(verificationTokens).where(
      and(
        eq(verificationTokens.identifier, identifier),
        eq(verificationTokens.token, otp),
        gt(verificationTokens.expiresAt, new Date())
      )
    ).limit(1);

    if (!otpRecord) {
      return ApiResponses.error("Invalid or expired verification code.", 400);
    }

    // --- CHANGE 4: Update institution status to PENDING_VERIFICATION ---
    // This is a critical step in our conceptual plan.
    // We find the institution this user created and update its status.
    const [updatedInstitution] = await db
      .update(institutions)
      .set({
        status: "PENDING",
        updatedAt: new Date(),
      })
      .where(eq(institutions.createdById, user.id)) // Find the institution linked to this user
      .returning({ id: institutions.id, name: institutions.name });

    if (!updatedInstitution) {
      return ApiResponses.notFound("Could not find an institution registration for this user.");
    }

    // 2. Assign the INSTITUTION_ADMIN role
    await db.insert(userRoles).values({ userId: user.id, role: "INSTITUTION_ADMIN" }).onConflictDoNothing();

    // 3. Mark the user's general onboarding as complete
    await db.update(users)
      .set({ onboardingComplete: true, updatedAt: new Date() })
      .where(eq(users.id, user.id));

    // 4. Clean up by deleting the used verification token
    await db.delete(verificationTokens).where(eq(verificationTokens.identifier, identifier));

    return ApiResponses.success({
      success: true,
      message: "Institution verified and submitted for review.",
      redirectTo: "/onboarding/institution/pending-approval",
    });

  } catch (error) {
    return ApiResponses.handleError(error);
  }
}
