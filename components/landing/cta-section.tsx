import { Button } from "@/components/ui/button";
import { FogLayers } from "@/components/landing/fog-layers";

/**
 * CtaSection — penutup: band yang padat (bukan 100vh kosong), dengan
 * siluet Kuntilanak ber-mata merah di tepi kanan dan ornamen kembang
 * kamboja. Menutup lingkaran dari hero tanpa mengulang hero.
 */
export function CtaSection() {
  return (
    <section className="relative flex overflow-hidden py-28 text-center md:py-36">
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-background via-[#070d14] to-[#0d1824]"
      />
      {/* Cahaya lampu minyak dari bawah: titik fokus hangat di tengah */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-1/2 bg-[radial-gradient(ellipse_at_50%_100%,rgba(232,180,74,0.16),transparent_65%)]"
      />
      <FogLayers className="opacity-80" />

      {/* Kuntilanak: bagian dari komposisi, terpotong tepi kanan */}
      <img
        aria-hidden
        src="/horror/kuntilanak-poster.svg"
        alt=""
        className="pointer-events-none absolute -right-4 bottom-0 hidden h-[85%] w-auto opacity-50 md:block"
      />

      <div className="wrap relative z-10 mx-auto flex max-w-2xl flex-col items-center px-6">
        {/* Ornamen kembang sebagai pemisah */}
        <div aria-hidden className="mb-8 flex items-center gap-3">
          <span className="h-px w-12 bg-gradient-to-r from-transparent to-primary/60" />
          <img src="/horror/petal.svg" alt="" className="h-5 w-5 text-primary" />
          <span className="h-px w-12 bg-gradient-to-l from-transparent to-primary/60" />
        </div>

        <h2 className="type-section text-[clamp(2.2rem,5vw,4rem)] text-foreground">
          Don&apos;t let your specs{" "}
          <span className="text-primary [text-shadow:0_0_24px_rgba(232,180,74,0.4)]">
            haunt the backlog
          </span>
        </h2>
        <p className="mt-4 max-w-xl text-muted-foreground">
          Write the spec, let the assistant refine it, and send it to the
          agent that finishes the job. That is the whole ritual.
        </p>
        <div className="mt-8">
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
