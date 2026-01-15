// app/(platform)/_actions/marketing-actions.ts
"use server";

import { db } from "@/db";
import { marketingLeads } from "@/db/schema";
import { createId } from "@paralleldrive/cuid2";
import { z, ZodError } from "zod";
import { eq } from "drizzle-orm";
import { validateRequest } from "@/lib/auth";
import { RoleGuard } from "@/lib/utils/roles";

const leadSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  subject: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
  company: z.string().optional(),
  type: z.enum(["CONTACT", "ENTERPRISE", "DEMO"]).default("CONTACT"),
});

export async function submitMarketingLead(formData: FormData) {
  try {
    const rawData = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      subject: (formData.get("subject") as string) || undefined,
      message: formData.get("message") as string,
      company: (formData.get("company") as string) || undefined,
      type: (formData.get("type") as any) || "CONTACT",
    };

    const validated = leadSchema.parse(rawData);

    await db.insert(marketingLeads).values({
      id: createId(),
      name: validated.name,
      email: validated.email,
      subject: validated.subject || null,
      message: validated.message,
      type: validated.type,
      status: "NEW",
      metadata: validated.company ? { company: validated.company } : null,
    });

    return { success: true };
  } catch (error) {
    console.error("Lead submission error:", error);
    if (error instanceof ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    return { success: false, error: "Something went wrong. Please try again later." };
  }
}

/**
 * Mark a lead as "seen" to clear notification badges without replying.
 */
export async function markLeadAsSeen(leadId: string) {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    await RoleGuard.requireRole(user.id, "PLATFORM_ADMIN");

    await db
      .update(marketingLeads)
      .set({ seenAt: new Date() })
      .where(eq(marketingLeads.id, leadId));

    return { success: true };
  } catch (error) {
    console.error("Mark lead as seen error:", error);
    return { success: false, error: "Failed to mark lead as seen" };
  }
}
