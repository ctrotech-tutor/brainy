"use server";

import { db } from "@/db";
import { notifications, notificationTypeEnum } from "@/db/schema";
import { requireAuth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { eq, desc, and } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";

export type NotificationType = "INFO" | "SUCCESS" | "WARNING" | "ERROR";

export async function getUnreadNotifications() {
    const { user } = await requireAuth();

    const data = await db
        .select()
        .from(notifications)
        .where(
            and(
                eq(notifications.recipientId, user.id),
                eq(notifications.isRead, false)
            )
        )
        .orderBy(desc(notifications.createdAt));

    return data;
}

export async function getAllNotifications(limit = 20) {
    const { user } = await requireAuth();

    const data = await db
        .select()
        .from(notifications)
        .where(eq(notifications.recipientId, user.id))
        .orderBy(desc(notifications.createdAt))
        .limit(limit);

    return data;
}

export async function markAsRead(notificationId: string) {
    const { user } = await requireAuth();

    await db
        .update(notifications)
        .set({ isRead: true })
        .where(
            and(
                eq(notifications.id, notificationId),
                eq(notifications.recipientId, user.id)
            )
        );

    revalidatePath("/platform");
}

export async function markAllAsRead() {
    const { user } = await requireAuth();

    await db
        .update(notifications)
        .set({ isRead: true })
        .where(
            and(
                eq(notifications.recipientId, user.id),
                eq(notifications.isRead, false)
            )
        );

    revalidatePath("/platform");
}

// Internal function to create notifications
export async function createNotification(
    recipientId: string,
    title: string,
    message: string,
    type: NotificationType = "INFO",
    link?: string
) {
    try {
        await db.insert(notifications).values({
            id: createId(),
            recipientId,
            title,
            message,
            type,
            link,
            isRead: false,
        });
        // We don't revalidate path here usually because this is called by other actions
        // However, if we wanted real-time, we'd trigger a socket event here.
    } catch (error) {
        console.error("Failed to create notification:", error);
    }
}
