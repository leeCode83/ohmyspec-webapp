import { Nav } from "@/components/landing/nav";
import { Hero } from "@/components/landing/hero";
import { ToolSection } from "@/components/landing/tool-section";
import { ProcessSection } from "@/components/landing/process-section";
import { DrawingTableSection } from "@/components/landing/drawing-table-section";
import { CtaSection } from "@/components/landing/cta-section";
import { Footer } from "@/components/landing/footer";

/**
 * Halaman landing OhmySpec — tema blueprint + hard hat.
 * Urutan: hero (sheet A-101) → perkakas → urutan kerja → meja gambar →
 * penutup title block → footer.
 */
export default function Home() {
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
