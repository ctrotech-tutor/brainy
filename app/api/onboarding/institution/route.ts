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

export async function POST(req: NextRequest) {
  try {
    const { user } = await requireAuth();
    const body = await req.json();

    const validation = institutionDetailsSchema.safeParse(body);
    if (!validation.success) {
      return ApiResponses.validationError(validation.error.issues);
    }

    const data = validation.data;
    
    const { name, domain, adminEmail } = data;

    if (user.onboardingComplete) {
      return ApiResponses.error("Onboarding already completed.", 400);
    }

    const isAcademic = await Verifier.isAcademic(data.adminEmail);

    if (!isAcademic) {
      return ApiResponses.error("The provided email is not from a recognized academic institution.", 400);
    }

    const adminEmailDomain = data.adminEmail.split('@')[1];
    if (data.domain && adminEmailDomain.toLowerCase() !== data.domain.toLowerCase()) {
      return ApiResponses.error(`Your email domain (@${adminEmailDomain}) does not match the institution's domain (@${data.domain}).`, 400);
    }

    const [existingInstitution] = await db
      .select()
      .from(institutions)
      .where(or(eq(institutions.name, name), eq(institutions.domain, domain)))
      .limit(1);

    if (existingInstitution) {
      return ApiResponses.error("An institution with this name or domain already exists.", 409);
    }

    // --- THIS IS THE FIX ---
    // We now insert the `country` value into the `address` column.
    await db
      .insert(institutions)
      .values({
        name: data.name,
        domain: data.domain,
        website: data.website,
        country: data.country,
        type: data.institutionType as any,
        ownership: data.ownership as any,
        yearEstablished: data.yearEstablished,
        contactEmail: data.adminEmail,
        status: "PENDING",
        createdById: user.id,
      })
      .returning();

    const verificationAttemptToken = generateVerificationToken();
    const otp = generateNumericOTP(6);
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
