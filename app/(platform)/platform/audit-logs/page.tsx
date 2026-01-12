// app/(platform)/platform/audit-logs/page.tsx
import { Metadata } from "next";
import AuditLogsClient from "./AuditLogsClient";

export const metadata: Metadata = {
  title: "Audit Logs",
  description: "View system usage logs",
};

export default function AuditLogsPage() {
  return <AuditLogsClient />;
}
