import { Hero } from "@/components/Hero";
import {
  AboutSection,
  ContactSection,
  EducationSection,
  EvidenceAtGlanceSection,
  ExperienceSection,
  ExpertiseSection,
  FeaturedEngineeringSection,
  RecognitionSection,
  WritingSection
} from "@/components/HomeSections";

export default function Home() {
  return (
    <main>
      <Hero />
      <AboutSection />
      <FeaturedEngineeringSection />
      <EvidenceAtGlanceSection />
      <WritingSection />
      <ExpertiseSection />
      <ExperienceSection />
      <RecognitionSection />
      <EducationSection />
      <ContactSection />
    </main>
  );
}
