// app/onboarding/institution/pending-approval/page.tsx
import { Metadata } from "next";
import PendingApprovalClient from "./PendingApprovalClient";

export const metadata: Metadata = {
  title: "Application Pending",
  description: "Your institution application is under review",
};

export default function PendingApprovalPage() {
  return <PendingApprovalClient />;
}
