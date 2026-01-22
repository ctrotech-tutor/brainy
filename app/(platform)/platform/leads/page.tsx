// app/(platform)/platform/leads/page.tsx
import { Metadata } from "next";
import { requireAuth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { LeadsClient } from "./LeadsClient";

export const metadata: Metadata = {
    title: "Lead Management | Platform Admin",
    description: "Manage and respond to marketing leads and inquiries.",
};

export default async function LeadsPage() {
    const { user } = await requireAuth();

    if (!user.roles.includes("PLATFORM_ADMIN")) {
        redirect("/dashboard");
    }

    return <LeadsClient />;
}
