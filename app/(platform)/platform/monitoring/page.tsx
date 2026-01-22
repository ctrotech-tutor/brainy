// app/(platform)/platform/monitoring/page.tsx
import { Metadata } from "next";
import MonitoringClient from "./MonitoringClient";

export const metadata: Metadata = {
    title: "System Monitoring | Platform Admin",
    description: "Real-time system diagnostics and telemetry.",
};

export default function AdminMonitoringPage() {
    return <MonitoringClient />;
}
