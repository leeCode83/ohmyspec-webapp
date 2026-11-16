import { Reveal } from "@/components/landing/reveal";
import { Section } from "@/components/landing/section";

import type { CSSProperties } from "react";

/**
 * HowSection — "Ritual": timeline horizontal lamp-lit (bukan stepper kartu).
 * Satu batang emas menyambung tiga nomor Romawi yang menyala seperti
 * lampu minyak. Komposisi sengaja sentris-horizontal agar berbeda dari
 * dua section lain yang kartu/daftar.
 */
const STEPS = [
  {
    n: "I",
    title: "Write the spec",
    body: "Start from a template (Spec, URS, Plan, Tasks, Diagram) or import a .md, .docx, or text PDF. Markdown autosaves as you type.",
  },
  {
    n: "II",
    title: "Let the assistant refine it",
    body: "The AI edits through tool-calls, and every proposed change arrives as a diff preview. Nothing is rewritten without your approval.",
  },
  {
    n: "III",
    title: "Dispatch it to your agent",
    body: "Export the spec as a prompt for Claude Code, Cursor, Copilot, Gemini CLI, or a generic agent, with its context attached.",
  },
] as const;

export function HowSection() {
  return (
    <Section id="how" className="items-stretch">
      <div aria-hidden className="fog-seam" />
      <Reveal className="mx-auto max-w-3xl text-center">
        <p className="type-section text-sm uppercase tracking-[0.22em] text-primary/80">
          The ritual
        </p>
        <h2 className="type-section mt-3 text-[clamp(2rem,4.5vw,3.75rem)] text-foreground">
          Three steps, one held breath
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          A haunting idea becomes a spec your coding agent can execute.
        </p>
      </Reveal>

      {/* Garis ritual: satu batang emas dengan tiga lampu menyala di atasnya */}
      <div className="relative mt-20">
        <div
          aria-hidden
          className="absolute left-[14%] right-[14%] top-[22px] hidden h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent md:block"
        />
        <Reveal className="grid gap-12 md:grid-cols-3 md:gap-8" stagger={140}>
          {STEPS.map((step, i) => (
            <div
              key={step.n}
              className="reveal-child relative text-center md:px-4"
              style={{ "--reveal-i": i } as CSSProperties}
            >
              {/* Nomor sebagai lampu: ring emas + halo hangat */}
              <div className="relative mx-auto flex h-11 w-11 items-center justify-center rounded-full border border-primary/60 bg-background">
                <span
                  aria-hidden
                  className="absolute inset-0 rounded-full bg-primary/20 blur-md"
                />
                <span className="type-ghost relative text-sm text-primary">
                  {step.n}
                </span>
              </div>
              <h3 className="type-ghost mt-6 text-xl text-foreground">
                {step.title}
              </h3>
              <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
                {step.body}
              </p>
            </div>
          ))}
        </Reveal>
      </div>
    </Section>
  );
}
