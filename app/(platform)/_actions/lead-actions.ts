// app/(platform)/_actions/lead-actions.ts
"use server";

import { db } from "@/db";
import { marketingLeads } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireAuth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const statusSchema = z.enum(["NEW", "READ", "REPLIED", "ARCHIVED"]);

/**
 * Updates the status of a marketing lead.
 */
export async function updateLeadStatus(leadId: string, status: string) {
  try {
    const { user } = await requireAuth();
    if (!user.roles.includes("PLATFORM_ADMIN")) {
      throw new Error("Unauthorized");
    }

    const validatedStatus = statusSchema.parse(status);

    await db.update(marketingLeads)
      .set({ status: validatedStatus })
      .where(eq(marketingLeads.id, leadId));

    revalidatePath("/platform/leads");
    return { success: true };
  } catch (error) {
    console.error("Failed to update lead status:", error);
    return { success: false, error: "Failed to update status." };
  }
}

import { sendLeadReplyEmail } from "@/lib/utils/email";

/**
 * Submits a reply to a marketing lead and updates its status.
 */
export async function submitLeadReply(leadId: string, content: string) {
  try {
    const { user } = await requireAuth();
    if (!user.roles.includes("PLATFORM_ADMIN")) {
      throw new Error("Unauthorized");
    }

    if (!content || content.trim().length < 5) {
      throw new Error("Reply content is too short.");
    }

    const lead = await db.query.marketingLeads.findFirst({
      where: eq(marketingLeads.id, leadId),
    });

    if (!lead) {
      throw new Error("Lead not found.");
    }

    // Send the actual email
    await sendLeadReplyEmail(
      lead.email,
      lead.name,
      lead.subject || "Inquiry",
      content.trim()
    );

    // Prepare the new reply object
    const newReply = {
      content: content.trim(),
      sentAt: new Date().toISOString(),
      sentBy: user.name || user.email,
      sentById: user.id,
    };

    // Update the reply thread (append to existing or initialize)
    const existingThread = Array.isArray(lead.replyThread) ? lead.replyThread : [];
    const updatedThread = [...existingThread, newReply];

    await db.update(marketingLeads)
      .set({
        status: "REPLIED",
        repliedAt: new Date(),
        lastRepliedById: user.id,
        replyThread: updatedThread,
      })
      .where(eq(marketingLeads.id, leadId));

    revalidatePath("/platform/leads");
    return { success: true };
  } catch (error) {
    console.error("Failed to submit lead reply:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to send reply." };
  }
}
