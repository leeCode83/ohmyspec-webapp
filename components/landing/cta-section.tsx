import { Button } from "@/components/ui/button";
import { FogLayers } from "@/components/landing/fog-layers";

/**
 * CtaSection — penutup: ajakan terakhir sebelum footer.
 * Suasana kembali ke malam (fog + vignette) agar halaman "menutup"
 * penuh lingkaran dari hero.
 */
export function CtaSection() {
  return (
    <section className="relative flex min-h-screen flex-col justify-center overflow-hidden px-6 py-32 text-center md:py-40">
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-background via-[#050a10] to-[#030609]"
      />
      <FogLayers className="opacity-70" />

      <div className="relative z-10 mx-auto max-w-2xl">
        <h2 className="type-section text-[clamp(2rem,4vw,3.25rem)] text-foreground">
          Don&apos;t let your specs{" "}
          <span className="text-primary [text-shadow:0_0_24px_rgba(232,180,74,0.4)]">
            haunt the backlog
          </span>
        </h2>
        <p className="mt-4 text-muted-foreground">
          Write the spec, let the assistant refine it, and send it to the
          agent that finishes the job. That is the whole ritual.
        </p>
        <div className="mt-8 flex justify-center">
          <Button
            size="lg"
            className="h-12 px-6 shadow-[0_0_28px_rgba(232,180,74,0.45)] transition-shadow hover:shadow-[0_0_40px_rgba(232,180,74,0.65)]"
          >
            Summon the workspace
          </Button>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          Open source under the MIT license. Clone it and run it yourself.
        </p>
      </div>
    </section>
  );
}
