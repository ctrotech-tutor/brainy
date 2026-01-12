// app/get-started/page.tsx
import { Metadata } from "next";
import GetStartedClient from "./GetStartedClient";

export const metadata: Metadata = {
  title: "Get Started",
  description: "Start your journey with Brainy",
};

export default function GetStartedPage() {
  return <GetStartedClient />;
}
