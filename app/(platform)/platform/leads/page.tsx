// app/(platform)/platform/leads/page.tsx
import { db } from "@/db";
import { marketingLeads } from "@/db/schema";
import { desc } from "drizzle-orm";
import { requireAuth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { LeadsClient } from "./LeadsClient";

export const metadata = {
    title: "Lead Management | Platform Admin",
    description: "Manage and respond to marketing leads and inquiries.",
};

export default async function LeadsPage() {
    const { user } = await requireAuth();

    if (!user.roles.includes("PLATFORM_ADMIN")) {
        redirect("/dashboard");
    }

    const leads = await db.query.marketingLeads.findMany({
        orderBy: [desc(marketingLeads.createdAt)],
    });

    return <LeadsClient initialLeads={leads as any} />;
}
