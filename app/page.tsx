import { Nav } from "@/components/landing/nav";
import { Hero } from "@/components/landing/hero";
import { Footer } from "@/components/landing/footer";

/**
 * Halaman landing OhmySpec — tema blueprint + hard hat.
 * Susunan section dibangun bertahap; sementara hanya Nav, Hero, Footer.
 */
export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
      </main>
      <Footer />
    </>
  );
}
