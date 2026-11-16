import { Button } from "@/components/ui/button";
import { FogLayers } from "@/components/landing/fog-layers";

/**
 * Hero — layar pertama: judul besar + CTA di atas komposisi malam
 * (bulan, beringin, fog). Komponen ini hanya struktur statis + entrance
 * animation; animasi horror berjalan-terus ada di HeroScene (Task 5).
 */
export function Hero() {
  return (
    <section
      id="summon"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-16 text-center"
    >
      {/* Gradient malam: biru atas → hampir hitam di bawah */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-[#0d1826] via-[#0b141e] to-[#050a10]"
      />
      {/* Beringin di horizon */}
      <img
        aria-hidden
        src="/horror/beringin.svg"
        alt=""
        className="pointer-events-none absolute bottom-0 left-1/2 w-[130%] max-w-none -translate-x-1/2 text-[#040a12] opacity-90 md:w-[110%]"
      />
      <FogLayers />

      <div className="relative z-10 flex max-w-3xl flex-col items-center gap-6">
        <p
          className="animate-hero-enter text-sm uppercase tracking-[0.35em] text-muted-foreground"
          style={{ animationDelay: "0.1s" }}
        >
          Spec-driven development, after dark
        </p>
        <h1
          className="animate-hero-enter font-heading text-5xl font-semibold leading-tight text-foreground md:text-7xl"
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
          OhmySpec is where small teams author, refine, and dispatch specs —
          with an AI assistant that haunts the unfinished ones. Leave a spec
          incomplete, and it comes back.
        </p>
        <div
          className="animate-hero-enter flex flex-col gap-4 sm:flex-row"
          style={{ animationDelay: "0.55s" }}
        >
          <Button
            size="lg"
            className="shadow-[0_0_28px_rgba(232,180,74,0.45)] transition-shadow hover:shadow-[0_0_40px_rgba(232,180,74,0.65)]"
          >
            Summon the workspace
          </Button>
          <Button size="lg" variant="outline">
            Read the lore
          </Button>
        </div>
        <p
          className="animate-hero-enter mt-4 text-xs text-muted-foreground/70"
          style={{ animationDelay: "0.7s" }}
        >
          Free and open source · Bring your own key · Self-hostable
        </p>
      </div>
    </section>
  );
}
