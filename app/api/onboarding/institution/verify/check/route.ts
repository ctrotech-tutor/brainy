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
      return ApiResponses.error("Invalid or expired token.", 404, { isValid: false });
    }

    // If we found a record, the token is valid.
    return ApiResponses.success({ isValid: true });

  } catch (error) {
    return ApiResponses.handleError(error);
  }
}
