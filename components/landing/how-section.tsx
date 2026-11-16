import { Section } from "@/components/landing/section";

/**
 * HowSection — "Ritual": tiga langkah pakai OhmySpec.
 * Layout sederhana 3 kolom dengan nomor besar bergaya lampu minyak;
 * alur ditandai garis putus-putus antar langkah (grid CSS murni).
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
    <Section id="how">
      <h2 className="type-section text-[clamp(2rem,4vw,3.25rem)] text-foreground">
        The ritual
      </h2>
      <p className="mt-4 max-w-2xl text-muted-foreground">
        Three steps take a haunting idea to a spec your coding agent can
        execute.
      </p>

      <ol className="mt-12 grid gap-10 md:grid-cols-3 md:gap-6">
        {STEPS.map((step) => (
          <li key={step.n} className="relative border-l border-dashed border-border/60 pl-6">
            <span className="absolute -left-[19px] top-0 flex h-9 w-9 items-center justify-center rounded-full border border-primary/50 bg-background font-heading text-sm text-primary shadow-[0_0_14px_rgba(232,180,74,0.3)]">
              {step.n}
            </span>
            <h3 className="font-heading text-xl font-semibold text-foreground">
              {step.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {step.body}
            </p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
