// app/(marketing)/pricing/page.tsx
import { constructMetadata } from "@/lib/seo";
import { PricingClient } from "./PricingClient";

export const metadata = constructMetadata({
    title: "Pricing Plans",
    description: "Flexible pricing tiers for independent students and educational institutions. Scale your academic integrity with Brainy.",
});

export default function PricingPage() {
    return <PricingClient />;
}
