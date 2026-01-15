// app/(marketing)/contact/page.tsx
import { constructMetadata } from "@/lib/seo";
import { ContactClient } from "./ContactClient";

export const metadata = constructMetadata({
  title: "Contact Us",
  description: "Get in touch with the Brainy team for institutional inquiries, support, or partnership opportunities.",
});

export default function ContactPage() {
  return <ContactClient />;
}
