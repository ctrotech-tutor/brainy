// app/api/onboarding/institution/route.ts
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { db } from "@/db";
import { institutions, verificationTokens } from "@/db/schema";
import { eq, or } from "drizzle-orm";
import { generateNumericOTP, generateVerificationToken, getVerificationTokenExpiration } from "@/lib/utils/auth";
import { sendInstitutionVerificationEmail } from "@/lib/utils/email";
import { institutionDetailsSchema } from "@/lib/validations/institution";

export async function POST(req: NextRequest) {
  try {
    const { user } = await requireAuth();
    const body = await req.json();

    // 1. Validate the complete data from the form
    const validation = institutionDetailsSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: "Invalid input", details: validation.error.issues }, { status: 400 });
    }
    const data = validation.data;

    // 2. Security check: User should not have completed onboarding
    if (user.onboardingComplete) {
      return NextResponse.json({ error: "Onboarding already completed." }, { status: 400 });
    }

    // 3. Prevent duplicate institutions
    const [existingInstitution] = await db
      .select()
      .from(institutions)
      .where(or(eq(institutions.name, data.name), eq(institutions.domain, data.domain)))
      .limit(1);

    if (existingInstitution) {
      return NextResponse.json({ error: "An institution with this name or domain already exists." }, { status: 409 });
    }

    // 4. Create the new institution record with all the rich data
    await db
      .insert(institutions)
      .values({
        name: data.name,
        domain: data.domain,
        website: data.website,
        country: data.country,
        type: data.institutionType as any, // Cast to 'any' if enum types don't match exactly
        ownership: data.ownership as any,
        yearEstablished: data.yearEstablished,
        contactEmail: data.adminEmail, // The admin's email is the primary contact
        status: "PENDING", // Initial status before email verification
        createdById: user.id, // Link to the user who created it
      });

    // 5. Generate the secure "ticket" token and the user-facing OTP
    const verificationTicket = generateVerificationToken(); // The secure token for the URL
    const otp = generateNumericOTP(6); // The 6-digit code for the user
    const expires = getVerificationTokenExpiration(15); // 15-minute expiry

    // Store the OTP with the secure ticket as the identifier
    await db.insert(verificationTokens).values({
      identifier: verificationTicket,
      token: otp,
      expires,
    });

    // 6. Send the verification email
    await sendInstitutionVerificationEmail(data.adminEmail, otp, data.name);

    // 7. Return a success response with the secure ticket
    return NextResponse.json(
      {
        success: true,
        message: "Institution details submitted. Please check your email for a verification code.",
        verificationToken: verificationTicket, // Send the ticket to the frontend
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Institution creation error:", error);
    return NextResponse.json({ error: "Failed to create institution" }, { status: 500 });
  }
}
