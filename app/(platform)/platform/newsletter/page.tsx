// app/(platform)/platform/newsletter/page.tsx
import { Metadata } from "next";
import { db } from "@/db";
import { newsletterBroadcasts, newsletterSubscribers } from "@/db/schema";
import { count, eq, desc } from "drizzle-orm";
import { requireAuth } from "@/lib/auth";
import { redirect } from "next/navigation";
import NewsletterClient from "./NewsletterClient";

export const metadata: Metadata = {
    title: "Newsletter | Platform Admin",
    description: "Manage subscribers and email broadcasts.",
};

export default async function NewsletterPage() {
    const { user } = await requireAuth();
    if (!user.roles.includes("PLATFORM_ADMIN")) redirect("/dashboard");

    // Fetch Stats
    const [subscribersCount] = await db
        .select({ count: count() })
        .from(newsletterSubscribers)
        .where(eq(newsletterSubscribers.status, "ACTIVE"));

    const [pendingCount] = await db
        .select({ count: count() })
        .from(newsletterSubscribers)
        .where(eq(newsletterSubscribers.status, "PENDING"));

    // Total count for stat card
    const [totalBroadcasts] = await db
        .select({ count: count() })
        .from(newsletterBroadcasts);

    return (
        <NewsletterClient
            subscribersCount={subscribersCount.count}
            pendingCount={pendingCount.count}
            totalBroadcasts={totalBroadcasts.count}
        />
    );
}
