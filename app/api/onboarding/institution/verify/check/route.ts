// app/api/onboarding/institution/verify/check/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { verificationTokens } from "@/db/schema";
import { and, eq, gt } from "drizzle-orm";
import { ApiResponses } from "@/lib/api-response";

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();

    if (!token) {
      console.warn("[VERIFY_CHECK_API_ERROR] Token missing in request.");
      return ApiResponses.error("Token is required.", 400);
    }

    // Check if a valid, non-expired token exists with this identifier
    const [otpRecord] = await db.select().from(verificationTokens).where(
      and(
        eq(verificationTokens.identifier, token),
        gt(verificationTokens.expires, new Date())
      )
    ).limit(1);

    if (!otpRecord) {
      console.warn("[VERIFY_CHECK_API_ERROR] No valid OTP record found for token:", token);
      return ApiResponses.error("Invalid or expired token.", 404, { isValid: false });
    }

    console.log("[VERIFY_CHECK_API_SUCCESS] Token validated:", token);
    // If we found a record, the token is valid.
    return ApiResponses.success({ isValid: true });

  } catch (error) {
    return ApiResponses.handleError(error);
  }
}
