// app/(marketing)/about/page.tsx
import { constructMetadata } from "@/lib/seo";
import { AboutClient } from "./AboutClient";

export const metadata = constructMetadata({
  title: "About Us",
  description: "Learn about Brainy's mission to redefine academic trust and our infrastructure for institutional excellence.",
});

export default function AboutPage() {
  return <AboutClient />;
}
