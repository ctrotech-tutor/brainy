import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
// --- 1. Import your new function ---
import { sendNewsletterSubscriptionNotification } from "@/lib/utils/email";

// Zod schema for validation (remains the same)
const emailSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

export async function POST(req: NextRequest) {
  try {
    // 2. Validate the request body
    const body = await req.json();
    const validation = emailSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { email } = validation.data;

    // 3. Call your centralized email function
    await sendNewsletterSubscriptionNotification(email);

    // 4. Send a success response
    return NextResponse.json(
      { message: "Success! You've been added to the newsletter." },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("[NEWSLETTER_SUBSCRIBE_ERROR]", error);
    return NextResponse.json(
      { error: "An internal server error occurred. Please try again later." },
      { status: 500 }
    );
  }
}
