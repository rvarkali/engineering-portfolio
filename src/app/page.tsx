import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import {
  AboutSection,
  CapabilityStrip,
  CareerSummarySection,
  Footer,
  FeaturedEngineeringSection
} from "@/components/HomeSections";

export default function Home() {
  return (
    <main className="min-h-screen bg-portfolio-bg text-portfolio-ink">
      <Header />
      <Hero />
      <CapabilityStrip />
      <AboutSection />
      <FeaturedEngineeringSection />
      <CareerSummarySection />
      <Footer />
    </main>
  );
}
