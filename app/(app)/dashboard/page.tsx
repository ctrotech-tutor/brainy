// app/(app)/dashboard/page.tsx
import { Metadata } from "next";
import { requireAuth } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Redirecting...",
  description: "Routing to your institutional command node.",
};

export default async function DashboardPage() {
  const { user } = await requireAuth();
  const roles = user.roles ?? [];

  // --- BEST PRACTICE: ROLE-BASED TRAFFIC CONTROL ---
  // We prioritize the highest-privilege role for the redirect
  if (roles.includes("PLATFORM_ADMIN")) {
    redirect("/platform/dashboard");
  }

  if (roles.includes("INSTITUTION_ADMIN")) {
    redirect("/dashboard/institution");
  }

  if (roles.includes("STUDENT")) {
    redirect("/dashboard/student");
  }

  if (roles.includes("TUTOR")) {
    redirect("/dashboard/tutor");
  }

  // Fallback for authenticated users without specific roles
  // Usually this means they haven't started onboarding or are 'USER' role.
  redirect("/get-started");
}
