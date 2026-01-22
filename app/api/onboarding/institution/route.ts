// src/app/api/onboarding/institution/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Verifier } from "academic-email-verifier";
import { requireAuth } from "@/lib/auth";
import { db } from "@/db";
import { institutions, verificationTokens } from "@/db/schema";
import { eq, or } from "drizzle-orm";
import { generateNumericOTP, generateVerificationToken, getVerificationTokenExpiration } from "@/lib/utils/auth";
import { sendInstitutionVerificationEmail } from "@/lib/utils/email";
import { institutionDetailsSchema } from "@/lib/validations/institution";
import { ApiResponses } from "@/lib/api-response";
import { findNigerianInstitution } from "@/lib/data/institutions";

export async function POST(req: NextRequest) {
  try {
    const { user } = await requireAuth();
    const body = await req.json();

    const validation = institutionDetailsSchema.safeParse(body);
    if (!validation.success) {
      console.error("[ONBOARDING_API_VALIDATION_ERROR]", JSON.stringify(validation.error.issues, null, 2));
      return ApiResponses.validationError(validation.error.issues);
    }

    const data = validation.data;
    const { name, domain, adminEmail } = data;

    if (user.onboardingComplete) {
      console.warn("[ONBOARDING_API_ERROR] Onboarding already complete for user:", user.id);
      return ApiResponses.error("Onboarding already completed.", 400);
    }

    // --- LENIENT ACADEMIC VERIFICATION FOR NIGERIA ---
    const isEduNg = data.adminEmail.toLowerCase().endsWith(".edu.ng");
    const isAcademic = (await Verifier.isAcademic(data.adminEmail)) || isEduNg;

    console.log("[ONBOARDING_API_DEBUG] Verifier result:", isAcademic, "| isEduNg:", isEduNg, "for email:", data.adminEmail);

    if (!isAcademic) {
      console.warn("[ONBOARDING_API_ERROR] Non-academic email detected:", data.adminEmail);
      return ApiResponses.error("The provided email is not from a recognized academic institution.", 400);
    }

    const adminEmailDomain = data.adminEmail.split('@')[1];
    if (data.domain && adminEmailDomain.toLowerCase() !== data.domain.toLowerCase()) {
      console.warn("[ONBOARDING_API_ERROR] Domain mismatch. Admin Email Domain:", adminEmailDomain, "Form Domain:", data.domain);
      return ApiResponses.error(`Your email domain (@${adminEmailDomain}) does not match the institution's domain (@${data.domain}).`, 400);
    }

    // --- HYBRID VALIDATION LOGIC ---
    // Check if it's in our official Nigerian list
    const officialRecord = await findNigerianInstitution(name);

    let finalType = data.institutionType;
    let finalYear = data.yearEstablished;

    if (officialRecord) {
      // 1. Security Check: If they claim to be "University of Ibadan", they MUST match the official URL/Domain structure roughly?
      // Actually, the email domain check above covers the most important part (Admin ownership).
      // But we can Auto-Fill/Correction here.

      // Map JSON type to DB Enum
      if (officialRecord.type === "Federal") finalType = "FEDERAL_UNIVERSITY";
      if (officialRecord.type === "State") finalType = "STATE_UNIVERSITY";
      if (officialRecord.type === "Private") finalType = "PRIVATE_UNIVERSITY";

      if (officialRecord.year_of_establishment) {
        finalYear = parseInt(officialRecord.year_of_establishment, 10);
      }
    }

    const [existingInstitution] = await db
      .select()
      .from(institutions)
      .where(or(eq(institutions.name, name), eq(institutions.domain, domain)))
      .limit(1);

    if (existingInstitution) {
      return ApiResponses.error("An institution with this name or domain already exists.", 409);
    }

    await db
      .insert(institutions)
      .values({
        name: data.name,
        domain: data.domain,
        website: data.website,
        country: "Nigeria", // Enforce Nigeria
        state: data.state,
        lga: data.lga,
        address: data.address,
        contactPhone: data.phoneNumber,
        alternativePhone: data.alternativePhone,
        logo: data.logo,

        shortName: data.shortName,
        motto: data.motto,
        description: data.description,
        mission: data.mission,
        vision: data.vision,

        nucCode: data.nucCode,
        nbteCode: data.nbteCode,
        accreditationNumber: data.accreditationNumber,
        studentPopulation: data.studentPopulation as any,

        type: finalType as any,
        ownership: data.ownership as any,
        yearEstablished: finalYear,

        contactEmail: data.adminEmail,
        status: "PENDING",
        createdById: user.id,
      })
      .returning();

    const verificationAttemptToken = generateVerificationToken();
    const otp = generateNumericOTP(6);
    console.log(`[TESTING_OTP] Initial registration code for ${name}: ${otp}`);
    const expires = getVerificationTokenExpiration(15);
    const identifier = verificationAttemptToken;

    await db.insert(verificationTokens).values({
      identifier,
      token: otp,
      expires,
    });

    await sendInstitutionVerificationEmail(adminEmail, otp, name);

    return ApiResponses.success(
      {
        success: true,
        message: "Institution details submitted. Please check your email for a verification code.",
        verificationToken: verificationAttemptToken,
      },
      201
    );
  } catch (error) {
    return ApiResponses.handleError(error);
  }
}
