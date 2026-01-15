// app/(marketing)/features/page.tsx
import { constructMetadata } from "@/lib/seo";
import { FeaturesClient } from "./FeaturesClient";

export const metadata = constructMetadata({
    title: "Platform Features",
    description: "Explore Brainy's advanced capabilities for Students, Tutors, and Institutions. AI quiz generation, integrity guards, and global scaling infrastructure.",
});

export default function FeaturesPage() {
    return <FeaturesClient />;
}
