"use server";

import { db } from "@/db";
import { institutions, marketingLeads, notifications } from "@/db/schema";
import { count, eq, and, isNull } from "drizzle-orm";
import { requireAuth } from "@/lib/auth";

export async function getAdminNotificationCounts() {
  const { user } = await requireAuth();

  const [pending, unreplied, unreadNotes] = await Promise.all([
    db
      .select({ value: count() })
      .from(institutions)
      .where(eq(institutions.status, "PENDING")),
    db
      .select({ value: count() })
      .from(marketingLeads)
      .where(and(isNull(marketingLeads.repliedAt), isNull(marketingLeads.seenAt))),
    db
      .select({ value: count() })
      .from(notifications)
      .where(and(eq(notifications.recipientId, user.id), eq(notifications.isRead, false))),
  ]);

  return {
    pendingInstitutions: pending[0].value,
    unrepliedLeads: unreplied[0].value,
    unreadNotifications: unreadNotes[0].value,
  };
}
