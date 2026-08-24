import { Hero } from "@/components/Hero";
import {
  AboutSection,
  ContactSection,
  EducationSection,
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
      <ExpertiseSection />
      <ExperienceSection />
      <RecognitionSection />
      <EducationSection />
      <ContactSection />
    </main>
  );
}
