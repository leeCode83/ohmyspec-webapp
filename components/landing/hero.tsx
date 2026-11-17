import { Button } from "@/components/ui/button";
import { PlotterArt } from "@/components/figures/plotter/art";

/**
 * Hero — layar pertama: lembar gambar A-101.
 *
 * Kiri: copy masuk berurutan (animate-sheet-in + delay). Kanan: panel
 * "drawing frame" berborder cobalt tipis berisi IsoBuild yang menggambar
 * diri sendiri, plus strip title block di bawah (proyek, sheet, revisi,
 * skala). Satu aksi utama saja: Start a project (tombol hard-hat).
 */
export function Hero() {
  return (
    <section
      id="start"
      className="relative flex min-h-[calc(100svh-64px)] items-center pt-8 pb-16 md:pt-10 md:pb-24"
    >
      <div className="wrap grid gap-10 lg:grid-cols-2 lg:items-center">
        <div className="max-w-xl">
          <p
            className="animate-sheet-in type-label flex items-center gap-3 text-primary"
            style={{ animationDelay: "0.05s" }}
          >
            <span aria-hidden className="h-px w-8 bg-primary" />
            Spec workspace for small teams
          </p>
          <h1
            className="animate-sheet-in type-display mt-5 text-[clamp(2.6rem,5.6vw,4.5rem)]"
            style={{ animationDelay: "0.15s" }}
          >
            Every spec,{" "}
            <span className="relative inline-block text-primary">
              built to plan
              <svg
                aria-hidden
                viewBox="0 0 300 12"
                className="absolute -bottom-2 left-0 h-3 w-full"
                preserveAspectRatio="none"
              >
                <path
                  d="M2 9 C70 2 150 2 298 7"
                  fill="none"
                  stroke="var(--hard-hat)"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            .
          </h1>
          <p
            className="animate-sheet-in mt-5 text-[17px] leading-relaxed text-muted-foreground"
            style={{ animationDelay: "0.25s" }}
          >
            OhmySpec gives small teams one drawing table for the spec: author
            it from a template, let the assistant redline it, then dispatch
            it to your coding agent with its context attached.
          </p>
          <div
            className="animate-sheet-in mt-7 flex flex-col gap-3 sm:flex-row"
            style={{ animationDelay: "0.35s" }}
          >
            <Button
              asChild
              className="h-12 bg-[var(--hard-hat)] px-6 text-base text-[var(--graphite)] shadow-[3px_3px_0_var(--graphite)] transition-all hover:bg-[var(--hard-hat)]/90 active:translate-x-[3px] active:translate-y-[3px] active:shadow-none"
            >
              <a href="#start">Start a project</a>
            </Button>
          </div>
        </div>

        {/* Drawing frame: garis cobalt ganda ala template gambar teknik */}
        <figure
          className="animate-sheet-in relative border-2 border-primary/80 p-2 md:p-3 lg:justify-self-end lg:w-[calc(100%-2rem)]"
          style={{ animationDelay: "0.2s" }}
        >
          {/* Tanda sudut mengukur di luar bingkai (corner ticks) */}
          {[
            "-left-1.5 -top-1.5",
            "-right-1.5 -top-1.5",
            "-left-1.5 -bottom-1.5",
            "-right-1.5 -bottom-1.5",
          ].map((pos) => (
            <span
              key={pos}
              aria-hidden
              className={`absolute ${pos} h-3 w-3 border border-primary`}
            />
          ))}
          <div className="border border-primary/25 bg-[var(--sheet)]/70 p-3 md:p-4">
          <PlotterArt />
          </div>
          {/* Title block: strip bawah berbagi garis seperti lembar gambar asli */}
          <figcaption className="mt-2 grid grid-cols-4 divide-x divide-primary/30 border border-primary/30 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
            <div className="px-2 py-1.5">
              <p className="text-primary">Project</p>
              <p className="mt-0.5 text-foreground">OhmySpec</p>
            </div>
            <div className="px-2 py-1.5">
              <p className="text-primary">Sheet</p>
              <p className="mt-0.5 text-foreground">A-101</p>
            </div>
            <div className="px-2 py-1.5">
              <p className="text-primary">Rev</p>
              <p className="mt-0.5 text-foreground">04</p>
            </div>
            <div className="px-2 py-1.5">
              <p className="text-primary">Scale</p>
              <p className="mt-0.5 text-foreground">1:100</p>
            </div>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
