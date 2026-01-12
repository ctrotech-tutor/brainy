// app/(app)/dashboard/page.tsx
import { Metadata } from "next";
import DashboardClient from "./DashboardClient";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your personal dashboard",
};

export default function DashboardPage() {
  return <DashboardClient />;
}
