// app/(platform)/platform/dashboard/page.tsx
import { Metadata } from "next";
import DashboardClient from "./DashboardClient";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Platform overview and key statistics",
};

export default function PlatformDashboardPage() {
  return <DashboardClient />;
}
