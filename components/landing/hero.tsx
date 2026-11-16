import { Button } from "@/components/ui/button";
import { FogLayers } from "@/components/landing/fog-layers";
import { HeroScene } from "@/components/landing/hero-scene";

/**
 * Hero — layar pertama: judul besar + CTA di atas komposisi malam
 * (bulan, beringin, fog). Komponen ini hanya struktur statis + entrance
 * animation; animasi horror berjalan-terus ada di HeroScene (Task 5).
 */
export function Hero() {
  return (
    <section
      id="summon"
      className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 pb-16 pt-24 text-center md:min-h-screen"
    >
      {/* Langit malam: biru pekat di atas, hitam pekat di horizon */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-[#0f1c2c] via-[#0b141e] to-[#04080d]"
      />
      {/* Cakrawala beringin nyaris hitam, menyatu dengan tanah */}
      <img
        aria-hidden
        src="/horror/beringin.svg"
        alt=""
        className="pointer-events-none absolute bottom-0 left-1/2 w-[110%] max-w-none -translate-x-1/2 text-[#030910] md:w-[85%]"
      />
      <HeroScene />

      {/* Copy: digeser ke kanan agar tidak menabrak siluet Kuntilanak */}
      <div className="relative z-10 flex max-w-2xl flex-col items-center gap-6 md:ml-[22%] [text-shadow:0_1px_10px_rgba(5,10,16,0.9)]">
        <p
          className="animate-hero-enter text-xs uppercase tracking-[0.22em] text-muted-foreground"
          style={{ animationDelay: "0.1s" }}
        >
          Spec-driven development, after dark
        </p>
        <h1
          className="animate-hero-enter type-display text-[clamp(3rem,9vw,7.5rem)] text-foreground"
          style={{ animationDelay: "0.25s" }}
        >
          Every spec deserves{" "}
          <span className="text-primary [text-shadow:0_0_30px_rgba(232,180,74,0.45)]">
            closure
          </span>
        </h1>
        <p
          className="animate-hero-enter max-w-xl text-lg text-muted-foreground"
          style={{ animationDelay: "0.4s" }}
        >
          OhmySpec is where small teams author, refine, and dispatch specs.
          An AI assistant haunts the unfinished ones. Leave a spec
          incomplete, and it comes back.
        </p>
        <div
          className="animate-hero-enter flex flex-col gap-4 sm:flex-row"
          style={{ animationDelay: "0.55s" }}
        >
          <Button
            size="lg"
            className="h-12 px-6 shadow-[0_0_28px_rgba(232,180,74,0.45)] transition-shadow hover:shadow-[0_0_40px_rgba(232,180,74,0.65)]"
          >
            Summon the workspace
          </Button>
          <Button asChild size="lg" variant="outline" className="h-12 px-6">
            <a href="#ghosts">Meet the ghosts</a>
          </Button>
        </div>
        <p
          className="animate-hero-enter mt-4 text-xs text-muted-foreground"
          style={{ animationDelay: "0.7s" }}
        >
          Free and open source (MIT) · Bring your own key · Self-hosted in
          one docker compose up
        </p>
      </div>
    </section>
  );
}
