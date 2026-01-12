// src/app/api/onboarding/intent/route.ts
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { ApiResponses } from "@/lib/api-response";

// ============================================
// VALIDATION SCHEMA
// ============================================

const intentSchema = z.object({
  intent: z.enum(["student", "institution", "tutor"]),
});

// ============================================
// GET /api/onboarding/intent - Get current user's intent and status
// ============================================

export async function GET(req: NextRequest) {
  try {
    const { user } = await requireAuth();

    // Check if onboarding is already complete
    if (user.onboardingComplete) {
      return ApiResponses.success({
        complete: true,
        redirectTo: "/dashboard",
      });
    }

    // Return current intent and next steps
    return ApiResponses.success({
      complete: false,
      intent: user.onboardingIntent,
      suggestedPath: user.onboardingIntent
        ? `/onboarding/${user.onboardingIntent}/start`
        : "/onboarding/choose-path",
    });
  } catch (error) {
    return ApiResponses.handleError(error);
  }
}

// ============================================
// POST /api/onboarding/intent - Set user's onboarding intent
// ============================================

export async function POST(req: NextRequest) {
  try {
    const { user } = await requireAuth();
    const body = await req.json();

    // Validate input
    const validation = intentSchema.safeParse(body);
    if (!validation.success) {
      return ApiResponses.validationError(validation.error.issues);
    }

    const { intent } = validation.data;

    // Update user's intent
    const [updatedUser] = await db
      .update(users)
      .set({
        onboardingIntent: intent,
        updatedAt: new Date(),
      })
      .where(eq(users.id, user.id))
      .returning();

    return ApiResponses.success({
      success: true,
      intent: updatedUser.onboardingIntent,
      nextStep: `/onboarding/${intent}/start`,
    });
  } catch (error) {
    return ApiResponses.handleError(error);
  }
}