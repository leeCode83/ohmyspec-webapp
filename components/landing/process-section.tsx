import { Reveal } from "@/components/landing/reveal";
import { Section } from "@/components/landing/section";

import type { CSSProperties } from "react";

/**
 * ProcessSection — "The build order": tiga fase kerja sebagai garis ukur
 * (dimension line) horizontal. Satu garis cobalt dengan tick tiap 10%,
 * tiga simpul bulat di 1/3, 2/3 dan ujung, dan label mono jarak antar
 * simpul (12.0 m · 18.0 m). Di mobile garis ukur jadi rail vertikal di
 * kiri tiap fase, jadi metafora tetap terbaca.
 */
const PHASES = [
  {
    no: "01",
    span: "0 → 12.0",
    phase: "Draft",
    title: "Draw the spec",
    body: "Pick a template or import a .md, .docx or text PDF. The editor autosaves every second, so the sheet is never left half-drawn.",
  },
  {
    no: "02",
    span: "12.0 → 30.0",
    phase: "Redline",
    title: "Let the assistant mark it up",
    body: "Ask for an edit and the assistant answers with a diff preview. Nothing lands on the sheet until you approve it.",
  },
  {
    no: "03",
    span: "30.0 → 42.0",
    phase: "Dispatch",
    title: "Hand it to the crew",
    body: "Export the spec as a prompt for Claude Code, Cursor, Copilot or Gemini CLI, with the workspace context that belongs to it.",
  },
] as const;

export function ProcessSection() {
  return (
    <Section id="process" className="items-stretch">
      <Reveal>
        <div className="reveal-child max-w-2xl" style={{ "--reveal-i": 0 } as CSSProperties}>
          <p className="type-label text-primary">The build order</p>
          <h2 className="type-section mt-4 text-[clamp(2rem,4.2vw,3.5rem)]">
            Draft, redline, dispatch
          </h2>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground">
            Three phases, the same order every time, so a spec reaches the
            crew whole instead of half-finished.
          </p>
        </div>

        {/* Garis ukur: batang cobalt dengan tick dan tiga simpul fase */}
        <div className="relative mt-16 md:mt-20">
          <div aria-hidden className="absolute inset-x-0 top-0 hidden md:block">
            <div className="relative h-10">
              <span className="absolute inset-x-0 top-9 h-px bg-primary" />
              {/* Tick tiap 10%: tanda skala pada garis ukur */}
              {Array.from({ length: 11 }, (_, i) => (
                <span
                  key={i}
                  className={`absolute top-7 h-2 w-px bg-primary/70 ${i % 5 === 0 ? "top-6 h-3 bg-primary" : ""}`}
                  style={{ left: `${i * 10}%` }}
                />
              ))}
              {/* Simpul fase: 1/6, 1/2, 5/6 */}
              {[1 / 6, 1 / 2, 5 / 6].map((x) => (
                <span
                  key={x}
                  className="absolute top-9 flex h-3 w-3 -translate-x-1/2 -translate-y-1/2 items-center justify-center bg-[var(--sheet)]"
                  style={{ left: `${x * 100}%` }}
                >
                  <span className="h-3 w-3 rounded-full border-2 border-primary bg-[var(--hard-hat)]" />
                </span>
              ))}
            </div>
          </div>

          <div className="grid gap-12 md:grid-cols-3 md:gap-10 md:pt-14">
            {PHASES.map((p, i) => (
              <div
                key={p.no}
                className="reveal-child relative pl-8 md:pl-0"
                style={{ "--reveal-i": i + 1 } as CSSProperties}
              >
                {/* Rail vertikal di mobile: garis ukur yang diputar */}
                <span
                  aria-hidden
                  className="absolute left-2 top-1 h-full w-px bg-primary/50 md:hidden"
                />
                <span
                  aria-hidden
                  className="absolute left-2 top-1 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-primary bg-[var(--hard-hat)] md:hidden"
                />
                <p className="font-mono text-xs tracking-[0.14em] text-muted-foreground">
                  {p.no} · <span className="text-[var(--dim-ink)]">{p.span} m</span>
                </p>
                <p className="type-label mt-4 text-primary">{p.phase}</p>
                <h3 className="mt-2 font-heading text-xl font-bold tracking-tight">
                  {p.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {p.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
