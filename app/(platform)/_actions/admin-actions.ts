"use server";

import { db } from "@/db";
import { institutions, marketingLeads } from "@/db/schema";
import { eq, and, isNull } from "drizzle-orm";
import { validateRequest } from "@/lib/auth";

export async function getAdminNotificationCounts() {
  const { user } = await validateRequest();

  if (!user || (!user.roles.includes("PLATFORM_ADMIN"))) {
    return { pendingInstitutions: 0, unrepliedLeads: 0 };
  }

  try {
    // Institution statuses are uppercase in schema.ts
    const pendingInstitutionsList = await db
      .select({ id: institutions.id })
      .from(institutions)
      .where(eq(institutions.status, "PENDING"));

    const unrepliedLeadsList = await db
      .select({ id: marketingLeads.id })
      .from(marketingLeads)
      .where(and(isNull(marketingLeads.repliedAt), isNull(marketingLeads.seenAt)));

    return {
      pendingInstitutions: pendingInstitutionsList.length,
      unrepliedLeads: unrepliedLeadsList.length,
    };
  } catch (error) {
    console.error("Error fetching notification counts:", error);
    return { pendingInstitutions: 0, unrepliedLeads: 0 };
  }
}
