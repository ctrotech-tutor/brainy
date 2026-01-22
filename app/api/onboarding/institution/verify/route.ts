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

    console.log("[VERIFY_API_DEBUG] Body received:", body);

    // --- CHANGE 2: Use the correct schema for validation ---
    const validation = institutionVerificationSchema.safeParse(body);
    if (!validation.success) {
      console.error("[VERIFY_API_ERROR] Validation failure:", validation.error.issues);
      return ApiResponses.validationError(validation.error.issues);
    }
    const { pin: otp, token } = validation.data;

    // --- CHANGE 3: Use the secure "ticket" token as the identifier ---
    const identifier = token;
    console.log("[VERIFY_API_DEBUG] Searching for OTP:", otp, "with token:", identifier);
    const [otpRecord] = await db.select().from(verificationTokens).where(
      and(
        eq(verificationTokens.identifier, identifier),
        eq(verificationTokens.token, otp),
        gt(verificationTokens.expires, new Date())
      )
    ).limit(1);

    if (!otpRecord) {
      console.warn("[VERIFY_API_ERROR] OTP record not found or expired for token:", identifier);
      return ApiResponses.error("Invalid or expired verification code.", 400);
    }

    console.log("[VERIFY_API_SUCCESS] OTP verified for token:", identifier);

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
      console.error("[VERIFY_API_ERROR] No institution record found for user:", user.id);
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
    console.error("[VERIFY_API_CRITICAL_ERROR]", error);
    return ApiResponses.handleError(error);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { user } = await requireAuth();
    const body = await req.json();
    const { token: identifier } = body;

    console.log("[VERIFY_API_RESEND_DEBUG] Attempting resend for token:", identifier);

    if (!identifier) {
      return ApiResponses.error("Verification token is required.", 400);
    }

    // 1. Find the institution associated with this user
    // We assume the user is trying to resend the code for the institution they just created.
    const [institution] = await db
      .select()
      .from(institutions)
      .where(and(eq(institutions.createdById, user.id), eq(institutions.status, "PENDING")))
      .limit(1);

    if (!institution) {
      console.warn("[VERIFY_API_RESEND_ERROR] No pending institution found for user:", user.id);
      return ApiResponses.notFound("No pending institution registration found.");
    }

    // 2. Generate new OTP
    const otp = generateNumericOTP(6);
    console.log(`[TESTING_OTP] Resend code for ${institution.name}: ${otp}`);
    const expires = getVerificationTokenExpiration(15);

    // 3. Update or Insert the verification token
    // We use onConflictDoUpdate if the identifier already exists, or just insert.
    // Drizzle doesn't have a simple upscale for this schema easily without compound keys, 
    // but we can just delete old and insert new.
    await db.delete(verificationTokens).where(eq(verificationTokens.identifier, identifier));

    await db.insert(verificationTokens).values({
      identifier,
      token: otp,
      expires,
    });

    console.log("[VERIFY_API_RESEND_SUCCESS] New OTP generated for:", institution.name);

    // 4. Send the email
    if (institution.contactEmail) {
      await sendInstitutionVerificationEmail(institution.contactEmail, otp, institution.name);
    } else {
      console.error("[VERIFY_API_RESEND_ERROR] Institution has no contact email:", institution.id);
      return ApiResponses.error("Institution record is missing a contact email.", 500);
    }

    return ApiResponses.success({
      success: true,
      message: "Resend Protocol: New code transmitted successfully.",
    });

  } catch (error) {
    console.error("[VERIFY_API_RESEND_CRITICAL_ERROR]", error);
    return ApiResponses.handleError(error);
  }
}
