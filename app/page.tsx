import { Nav } from "@/components/landing/nav";
import { Hero } from "@/components/landing/hero";
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
      </main>
      <GrainOverlay />
    </>
  );
}
