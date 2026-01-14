import { Metadata } from "next";
import { requireAuth } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your personal dashboard",
};

export default async function DashboardPage() {
  const { user } = await requireAuth();
  const roles = user.roles ?? [];

  if (roles.includes("PLATFORM_ADMIN")) redirect("/platform/dashboard");
  if (roles.includes("INSTITUTION_ADMIN")) redirect("/dashboard/institution");
  if (roles.includes("STUDENT")) redirect("/dashboard/student");
  if (roles.includes("TUTOR")) redirect("/dashboard/tutor");

  return <DashboardClient />;
}
