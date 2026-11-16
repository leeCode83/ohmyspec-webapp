import { Nav } from "@/components/landing/nav";
import { Hero } from "@/components/landing/hero";
import { GhostFeatureSection } from "@/components/landing/ghost-feature-section";
import { HowSection } from "@/components/landing/how-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { CtaSection } from "@/components/landing/cta-section";
import { Footer } from "@/components/landing/footer";
import { GrainOverlay } from "@/components/landing/grain-overlay";

/**
 * Halaman landing OhmySpec — tema horror Indonesia ("Malam Jawa").
 * Susunan section satu per satu; GrainOverlay menutup seluruh halaman.
 */
export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <GhostFeatureSection />
        <HowSection />
        <FeaturesSection />
        <CtaSection />
      </main>
      <GrainOverlay />
      <Footer />
    </>
  );
}
