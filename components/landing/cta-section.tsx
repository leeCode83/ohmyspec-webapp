import { Button } from "@/components/ui/button";

/**
 * CtaSection — penutup: "Rough-in complete". Band padat (bukan 100vh
 * kosong) yang ditutup title block lembar gambar: proyek, sheet, revisi,
 * izin. Satu aksi utama (Start a project) + satu tautan sekunder ke repo.
 */
export function CtaSection() {
  return (
    <section id="start" className="relative border-t border-primary/30 py-20 md:py-28">
      <div className="wrap">
        <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="max-w-2xl">
            <p className="type-label flex items-center gap-3 text-primary">
              <span aria-hidden className="h-px w-8 bg-primary" />
              Rough-in complete
            </p>
            <h2 className="type-section mt-5 text-[clamp(1.85rem,4vw,3.4rem)]">
              Can we build it?{" "}
              <span className="relative inline-block text-primary">
                Yes we can.
                <svg
                  aria-hidden
                  viewBox="0 0 300 12"
                  className="absolute -bottom-2 left-0 h-3 w-full"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M2 8 C80 2 190 4 298 6"
                    fill="none"
                    stroke="var(--hard-hat)"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h2>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">
              Open source under MIT. Clone it, run it with one docker
              compose up, and keep your own model key. The spec is yours,
              the paper trail is yours, and so is the build.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button
                asChild
                className="h-12 bg-[var(--hard-hat)] px-6 text-base text-[var(--graphite)] shadow-[3px_3px_0_var(--graphite)] transition-all hover:bg-[var(--hard-hat)]/90 active:translate-x-[3px] active:translate-y-[3px] active:shadow-none"
              >
                <a href="#start">Start a project</a>
              </Button>
              <a
                href="https://github.com/leeCode83/ohmyspec-webapp"
                className="flex h-12 items-center px-2 font-mono text-xs uppercase tracking-[0.12em] text-foreground underline-offset-4 transition-colors hover:text-primary hover:underline"
              >
                Read the source on GitHub
              </a>
            </div>
          </div>

          {/* Title block penutup: data lembar, rata kanan seperti blok judul */}
          <dl className="grid w-full max-w-xs grid-cols-2 border border-primary/40 font-mono text-[10px] uppercase tracking-[0.12em] lg:max-w-[16rem]">
            {[
              ["Project", "OhmySpec"],
              ["Sheet", "A-101"],
              ["Revision", "04"],
              ["Status", "Ready to build"],
            ].map(([k, v], i) => (
              <div
                key={k}
                className={`px-3 py-2.5 ${i % 2 === 0 ? "border-r border-primary/30" : ""} ${i < 2 ? "border-b border-primary/30" : ""}`}
              >
                <dt className="text-primary">{k}</dt>
                <dd className="mt-1 normal-case tracking-normal text-foreground">
                  {v}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
