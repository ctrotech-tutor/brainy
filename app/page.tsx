import Navbar from "@/components/core/Navbar";
import HeroSection from "@/components/main/sections/Hero";
import ClientSection from "@/components/main/sections/Client";
import FeaturesSection from "@/components/main/sections/Features";
import HowItWorksSection from "@/components/main/sections/HowItWorks"; // Import the new section
import ForStudentsSection from "@/components/main/sections/ForStudents";
import ForTutorsSection from "@/components/main/sections/ForTutors";
import CtaSection from "@/components/main/sections/CTA";
import Footer from "@/components/core/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <ClientSection />
        <FeaturesSection />
        <HowItWorksSection />
        <ForStudentsSection />
        <ForTutorsSection />
        <CtaSection />
      </main>
      <Footer />
    </>
  );
}
