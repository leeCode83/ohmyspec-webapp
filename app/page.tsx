import { Nav } from "@/components/landing/nav";
import { Hero } from "@/components/landing/hero";
import { GhostFeatureSection } from "@/components/landing/ghost-feature-section";
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
      </main>
      <GrainOverlay />
    </>
  );
}
