// src/app/api/onboarding/student/route.ts
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { db } from "@/db";
import { verificationTokens, institutions, studentProfiles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { generateNumericOTP, generateVerificationToken, getVerificationTokenExpiration } from "@/lib/utils/auth";
import { sendStudentVerificationOTP } from "@/lib/utils/email";
import { studentDetailsSchema } from "@/lib/validations/onboarding";
import { ApiResponses } from "@/lib/api-response";

// ============================================
// POST /api/onboarding/student - Register as student (send OTP)
// ============================================
export async function POST(req: NextRequest) {
  try {
    const { user } = await requireAuth();
    const body = await req.json();

    // --- Validate the incoming data ---
    const validation = studentDetailsSchema.safeParse(body);
    if (!validation.success) {
      return ApiResponses.validationError(validation.error.issues);
    }

    const { institutionId, facultyId, departmentId, institutionalEmail, matricNumber } = validation.data;

    if (user.onboardingComplete) {
      return ApiResponses.error("Onboarding already completed", 400);
    }

    const [institution] = await db.select().from(institutions).where(eq(institutions.id, institutionId)).limit(1);
    if (!institution || !["APPROVED", "ACTIVE"].includes(institution.status!)) {
      return ApiResponses.error("Institution is not valid or not verified.", 400);
    }

    if (institution.domain) {
      const emailDomain = institutionalEmail.split("@")[1];
      if (emailDomain !== institution.domain) {
        return ApiResponses.error(`Your email must be from the ${institution.domain} domain.`, 400);
      }
    }

    // --- Create or update the dedicated student profile ---
    await db
      .insert(studentProfiles)
      .values({
        userId: user.id,
        institutionId,
        facultyId,
        departmentId,
        matricNumber,
        institutionalEmail: institutionalEmail.toLowerCase(),
        verifiedAt: null,
      })
      .onConflictDoUpdate({
        target: studentProfiles.userId,
        set: {
          institutionId,
          facultyId,
          departmentId,
          matricNumber,
          institutionalEmail: institutionalEmail.toLowerCase(),
          verifiedAt: null,
          updatedAt: new Date(),
        },
      });

    // --- Logic for the secure "ticket" token ---
    const verificationAttemptToken = generateVerificationToken();

    // --- Generate and store OTP ---
    const otp = generateNumericOTP(6);
    const expiresAt = getVerificationTokenExpiration(15); // 15 minutes

    const identifier = verificationAttemptToken;
    
    // Delete old OTPs for this identifier to prevent conflicts
    await db.delete(verificationTokens).where(eq(verificationTokens.identifier, identifier));

    // Store the new OTP
    await db.insert(verificationTokens).values({
      identifier,
      token: otp,
      expiresAt,
    });

    // Send OTP email
    await sendStudentVerificationOTP(institutionalEmail, otp, institution.name);

    return ApiResponses.success({
      success: true,
      message: "Verification code sent to your institutional email.",
      verificationToken: verificationAttemptToken,
    });

  } catch (error) {
    return ApiResponses.handleError(error);
  }
}
