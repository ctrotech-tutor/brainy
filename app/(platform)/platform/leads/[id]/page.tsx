// app/(platform)/platform/leads/[id]/page.tsx
import { db } from "@/db";
import { marketingLeads } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth";
import { LeadDetailClient } from "./LeadDetailClient";

interface LeadPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: LeadPageProps) {
  const { id } = await params;
  
  const lead = await db.query.marketingLeads.findFirst({
    where: eq(marketingLeads.id, id),
  });

  if (!lead) return { title: "Lead Not Found" };

  return {
    title: `Process Lead: ${lead.name} | Platform Admin`,
    description: `Detailed view and processing for lead from ${lead.name}.`,
  };
}

export default async function LeadDetailPage({ params }: LeadPageProps) {
  const { user } = await requireAuth();

  if (!user.roles.includes("PLATFORM_ADMIN")) {
    redirect("/dashboard");
  }

  const { id } = await params;
  
  const lead = await db.query.marketingLeads.findFirst({
    where: eq(marketingLeads.id, id),
    // If you add relations later, they can be fetched here
  });

  if (!lead) {
    notFound();
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <LeadDetailClient lead={lead} />
    </div>
  );
}