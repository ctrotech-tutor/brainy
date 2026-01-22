"use server";

import { db } from "@/db";
import { newsletterSubscribers, newsletterBroadcasts, auditLogs } from "@/db/schema";
import { createId } from "@paralleldrive/cuid2";
import { eq } from "drizzle-orm";
import { sendNewsletterVerificationEmail } from "@/lib/utils/email";
import { z } from "zod";
import { auth } from "@/auth";

const subscribeSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
});

type ActionState = {
  success?: boolean;
  message?: string;
  error?: string;
};

// ----------------------------------------------------------------------
// PUBLIC ACTIONS
// ----------------------------------------------------------------------

export async function subscribeToNewsletter(prevState: any, formData: FormData): Promise<ActionState> {
  try {
    const email = formData.get("email") as string;
    
    // Validate input
    const result = subscribeSchema.safeParse({ email });
    if (!result.success) {
      return { error: result.error.issues[0].message };
    }
    
    // Check if already subscribed
    const existing = await db.query.newsletterSubscribers.findFirst({
      where: eq(newsletterSubscribers.email, email)
    });

    if (existing) {
       if (existing.status === "ACTIVE") {
           return { success: true, message: "You are already subscribed!" };
       }
       // If PENDING or UNSUBSCRIBED, resend verification
       // Update token just in case
       const newToken = createId();
       await db.update(newsletterSubscribers).set({
           token: newToken,
           status: "PENDING", // Reset to pending if they were unsubscribed
           verifiedAt: null // Clear verification if re-subscribing
       }).where(eq(newsletterSubscribers.id, existing.id));

       await sendNewsletterVerificationEmail(email, newToken);
       return { success: true, message: "Welcome back! Please check your email to verify." };
    }

    // New subscriber
    const token = createId();
    await db.insert(newsletterSubscribers).values({
        id: createId(),
        email: email,
        token: token,
        status: "PENDING",
        createdAt: new Date()
    });

    await sendNewsletterVerificationEmail(email, token);
    
    return { success: true, message: "Thanks! Please check your email to verify subscription." };

  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return { error: "Something went wrong. Please try again." };
  }
}

export async function verifySubscriber(token: string): Promise<ActionState> {
    try {
        const subscriber = await db.query.newsletterSubscribers.findFirst({
            where: eq(newsletterSubscribers.token, token)
        });

        if (!subscriber) {
            return { error: "Invalid verification token." };
        }

        if (subscriber.status === "ACTIVE") {
            return { success: true, message: "Email already verified." };
        }

        await db.update(newsletterSubscribers).set({
            status: "ACTIVE",
            verifiedAt: new Date()
        }).where(eq(newsletterSubscribers.id, subscriber.id));

        return { success: true, message: "Email verified successfully!" };

    } catch (error) {
        console.error("Verification error:", error);
        return { error: "Failed to verify email." };
    }
}

export async function unsubscribe(token: string): Promise<ActionState> {
    try {
        const subscriber = await db.query.newsletterSubscribers.findFirst({
            where: eq(newsletterSubscribers.token, token)
        });

        if (!subscriber) {
             return { error: "Invalid token." };
        }

        await db.update(newsletterSubscribers).set({
            status: "UNSUBSCRIBED",
            unsubscribedAt: new Date()
        }).where(eq(newsletterSubscribers.id, subscriber.id));

        return { success: true, message: "You have been unsubscribed." };
    } catch (error) {
        console.error("Unsubscribe error:", error);
        return { error: "Failed to unsubscribe." };
    }
}

// ----------------------------------------------------------------------
// ADMIN ACTIONS
// ----------------------------------------------------------------------

export async function sendTestBroadcast(subject: string, content: string): Promise<ActionState> {
    try {
        const session = await auth();
        
        if (!session?.user?.email) {
            return { error: "Unauthorized" };
        }

        const { sendNewsletterBroadcast } = await import("@/lib/utils/email");
        await sendNewsletterBroadcast(session.user.email, `[TEST] ${subject}`, content, "test-token");
        
        return { success: true };
    } catch (error) {
        console.error("Test broadcast error:", error);
        return { error: "Failed to send test email." };
    }
}

export async function sendBroadcast(subject: string, content: string): Promise<ActionState> {
    try {
        const session = await auth();
        
        if (!session?.user?.roles.includes("PLATFORM_ADMIN")) {
            return { error: "Unauthorized" };
        }

        const { sendNewsletterBroadcast } = await import("@/lib/utils/email");

        // 1. Create Broadcast Record
        const broadcastId = createId();
        await db.insert(newsletterBroadcasts).values({
            id: broadcastId,
            subject,
            content,
            authorId: session.user.id,
            status: "PROCESSING",
            createdAt: new Date(),
        });

        // 2. Fetch Active Subscribers
        const subscribers = await db.query.newsletterSubscribers.findMany({
            where: eq(newsletterSubscribers.status, "ACTIVE")
        });

        if (subscribers.length === 0) {
            await db.update(newsletterBroadcasts).set({
                status: "COMPLETED",
                recipientsCount: 0,
                sentAt: new Date()
            }).where(eq(newsletterBroadcasts.id, broadcastId));
            return { success: true, message: "No active subscribers to send to." };
        }

        // 3. Send Emails (Sequential Loop)
        let sentCount = 0;
        
        for (const sub of subscribers) {
             try {
                 await sendNewsletterBroadcast(sub.email, subject, content, sub.token);
                 sentCount++;
                 
                 // Small delay to be gentle on SMTP if list is small
                 await new Promise(resolve => setTimeout(resolve, 100));
                 
             } catch (e) {
                 console.error(`Failed to send to ${sub.email}`, e);
             }
        }

        // 4. Update Broadcast Status
        await db.update(newsletterBroadcasts).set({
            status: "COMPLETED",
            recipientsCount: sentCount,
            sentAt: new Date()
        }).where(eq(newsletterBroadcasts.id, broadcastId));

        // 5. Audit Log
        await db.insert(auditLogs).values({
            id: createId(),
            actorId: session.user.id,
            action: "NEWSLETTER_BROADCAST",
            resourceId: broadcastId,
            resourceTable: "newsletter_broadcasts",
            payload: { subject, recipient_count: sentCount },
            createdAt: new Date(),
        });

        return { success: true, message: `Broadcast sent to ${sentCount} subscribers.` };

    } catch (error) {
         console.error("Broadcast error:", error);
         // Mark as FAILED?
         return { error: "Failed to broadcast." };
    }
}
