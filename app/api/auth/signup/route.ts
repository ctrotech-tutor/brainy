// src/app/api/auth/signup/route.ts
import { NextRequest } from "next/server";
import { db } from "@/db";
import { users, userRoles, verificationTokens } from "@/db/schema";
import { hashPassword, isStrongPassword, generateVerificationToken, getVerificationTokenExpiration } from "@/lib/utils/auth";
import { sendVerificationEmail } from "@/lib/utils/email";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { ApiResponses } from "@/lib/api-response";

// ============================================
// VALIDATION SCHEMA
// ============================================

// --- CHANGE 1: Removed onboardingIntent from the body schema ---
const signupBodySchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
});

// ============================================
// POST /api/auth/signup
// ============================================

export async function POST(req: NextRequest) {
  try {
    // --- CHANGE 2: Read the 'intent' from the URL query parameters ---
    const { searchParams } = new URL(req.url);
    const intent = searchParams.get("intent"); // This will be 'student', 'institution', or null

    const body = await req.json();

    // Validate input body
    const validation = signupBodySchema.safeParse(body);
    if (!validation.success) {
      return ApiResponses.validationError(validation.error.issues);
    }

    // --- CHANGE 3: Destructure from validation.data, not the old schema ---
    const { email, password, name } = validation.data;

    // Additional password strength validation
    const passwordCheck = isStrongPassword(password);
    if (!passwordCheck.valid) {
      return ApiResponses.error("Weak password", 400, passwordCheck.errors);
    }

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()))
      .limit(1);

    if (existingUser.length > 0) {
      return ApiResponses.error("Email already registered", 409);
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const [newUser] = await db
      .insert(users)
      .values({
        email: email.toLowerCase(),
        hashedPassword,
        name: name || undefined, // Use undefined to let the database handle the default
        emailVerified: null,
        // --- CHANGE 4: Use the 'intent' from the URL ---
        onboardingIntent: intent, // This directly saves the intent from the URL
        onboardingComplete: false,
      })
      .returning();

    // Assign default role (USER)
    await db.insert(userRoles).values({
      userId: newUser.id,
      role: "USER",
    });

    // Generate verification token
    const token = generateVerificationToken();
    const expiresAt = getVerificationTokenExpiration();

    await db.insert(verificationTokens).values({
      identifier: newUser.email,
      token,
      expiresAt,
    });

    // --- CHANGE 5: Dynamically determine the redirect URL for the email ---
    let redirectPath = "/onboarding/choose-path"; // Default fallback
    if (intent === "student") {
      redirectPath = "/onboarding/student/start";
    } else if (intent === "institution") {
      redirectPath = "/onboarding/institution/start";
    }

    // Send verification email with the dynamic redirect path
    try {
      // We assume your sendVerificationEmail function can accept the redirectPath
      // If not, we will adjust it in the next step.
      await sendVerificationEmail(newUser.email, token, redirectPath);
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError);
      // Don't fail the signup if email fails, user can resend
    }

    return ApiResponses.success(
      {
        message: "User created successfully. Please verify your email.",
        userId: newUser.id,
      },
      201
    );
  } catch (error) {
    return ApiResponses.handleError(error);
  }
}
