import { Nav } from "@/components/landing/nav";
import { Hero } from "@/components/landing/hero";
import { ToolSection } from "@/components/landing/tool-section";
import { ProcessSection } from "@/components/landing/process-section";
import { DrawingTableSection } from "@/components/landing/drawing-table-section";
import { CtaSection } from "@/components/landing/cta-section";
import { Footer } from "@/components/landing/footer";

/**
 * Marketing landing at "/" for anonymous visitors (hybrid / decision).
 * Markup moved verbatim from the former app/page.tsx.
 */
export default function LandingView() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <ToolSection />
        <ProcessSection />
        <DrawingTableSection />
        <CtaSection />
      </main>
      <Footer />
    </>
  );
}
