import { Metadata } from "next";
import { StatusClient } from "./StatusClient";

export const metadata: Metadata = {
  title: "System Status | Brainy",
  description: "Real-time operating status of Brainy services.",
};

export default function StatusPage() {
  return <StatusClient />;
}
