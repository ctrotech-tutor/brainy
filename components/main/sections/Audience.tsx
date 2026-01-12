// components/main/sections/AudienceSection.tsx
import { Wrapper } from "@/components/ui/wrapper";
import ForStudentsSection from "./for-students";
import ForTutorsSection from "./for-tutors";
import ForInstitutionsSection from "./for-institutions";

const AudienceSection = () => {
  return (
    // We'll use a neutral background that allows the inner sections to stand out
    <section className="bg-transparent pt-20 sm:pt-28">
      <Wrapper>
        {/* The Main Section Title */}
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tighter text-foreground sm:text-4xl md:text-5xl">
            Who Brainy Is For
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Tailored solutions for every role in the academic ecosystem.
          </p>
        </div>
      </Wrapper>

      {/* 
        The individual sections are nested inside. 
        We remove the top padding from the inner sections to avoid double padding.
        The `pt-0` class will be added in the next step.
      */}
      <div className="mt-16 space-y-4">
        <ForStudentsSection/>
        <ForTutorsSection />
        <ForInstitutionsSection/>
      </div>
    </section>
  );
};

export default AudienceSection;
