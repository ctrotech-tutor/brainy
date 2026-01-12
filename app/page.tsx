// app/page.tsx
import { Metadata } from "next";
import Navbar from "@/components/core/nav-bar";
import HeroSection from "@/components/main/sections/Hero";
import ClientSection from "@/components/main/sections/Client";
import FeaturesSection from "@/components/main/sections/Features";
import HowItWorksSection from "@/components/main/sections/how-it-works";
import AudienceSection from "@/components/main/sections/Audience";
import InstitutionSystemSection from "@/components/main/sections/institution-system";
import SecuritySection from "@/components/main/sections/security";
import CtaSection from "@/components/main/sections/CTA";
import Footer from "@/components/core/Footer";
import WhyBrainySection from "@/components/main/sections/why-brainy";

import { validateRequest } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Brainy - Student & Institution Verification Platform",
  description: "Secure, real-time academic verification for students and institutions.",
};

export default async function Home() {
  const { user } = await validateRequest();

  return (
    <>
      <Navbar user={user} />
      <main>
        <HeroSection user={user} />
        <ClientSection />
        <FeaturesSection />
        <HowItWorksSection />
        <AudienceSection />
        <InstitutionSystemSection />
        <SecuritySection />
        <WhyBrainySection />
        <CtaSection />
      </main>
      <Footer />
    </>
  );
}
