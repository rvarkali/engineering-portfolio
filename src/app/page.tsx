import { Hero } from "@/components/Hero";
import {
  AboutSection,
  ContactSection,
  EducationSection,
  EvidenceAtGlanceSection,
  ExperienceSection,
  ExpertiseSection,
  FeaturedEngineeringSection,
  RecognitionSection
} from "@/components/HomeSections";

export default function Home() {
  return (
    <main>
      <Hero />
      <AboutSection />
      <FeaturedEngineeringSection />
      <EvidenceAtGlanceSection />
      <ExpertiseSection />
      <ExperienceSection />
      <RecognitionSection />
      <EducationSection />
      <ContactSection />
    </main>
  );
}
