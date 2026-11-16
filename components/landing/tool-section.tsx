import { Reveal } from "@/components/landing/reveal";
import { Section } from "@/components/landing/section";
import { ToolIcon, type ToolName } from "@/components/landing/tool-kit";

import type { CSSProperties } from "react";

/**
 * ToolSection — "The tool kit": enam perkakas lahan → enam bagian kerja
 * OhmySpec (PRD §4). Tiap kartu = potongan gambar teknik yang belum
 * diarsir: border putus-putus cobalt, jadi garis solid saat hover, dengan
 * tiga tick sudut (corner marks) dan nomor part ala bill-of-materials.
 */
const TOOLS: {
  tool: ToolName;
  part: string;
  title: string;
  body: string;
}[] = [
  {
    tool: "clipboard",
    part: "P-01",
    title: "Template sheets",
    body: "Every document starts from Spec, URS, Plan, Tasks, Diagram or Blank, and every one of them lands in the same flat list.",
  },
  {
    tool: "pencil",
    part: "P-02",
    title: "Assistant redlines",
    body: "The AI proposes edits as diff previews. You approve, reject or reshape each one before anything changes on the sheet.",
  },
  {
    tool: "wrench",
    part: "P-03",
    title: "Workspace knowledge",
    body: "Every autosaved document is chunked and embedded, so a question in one spec can be answered from another.",
  },
  {
    tool: "level",
    part: "P-04",
    title: "Single-writer lock",
    body: "One editor at a time. While you hold the sheet, everyone else reads it, so two edits never collide.",
  },
  {
    tool: "tape",
    part: "P-05",
    title: "Import and export",
    body: "Bring in .md, .docx or a text PDF. Send the spec out as a prompt for Claude Code, Cursor, Copilot or Gemini CLI.",
  },
  {
    tool: "hammer",
    part: "P-06",
    title: "Your own key",
    body: "Connect OpenAI, Anthropic, Gemini or OpenRouter. The key stays encrypted on the server, and documents work without one.",
  },
];

export function ToolSection() {
  return (
    <Section id="tools" tone="panel" className="items-stretch">
      <Reveal className="grid gap-x-14 gap-y-8 lg:grid-cols-[0.55fr_1.45fr] lg:items-start">
        <div className="reveal-child lg:sticky lg:top-28" style={{ "--reveal-i": 0 } as CSSProperties}>
          <p className="type-label text-primary">The tool kit</p>
          <h2 className="type-section mt-4 text-[clamp(2rem,4.2vw,3.5rem)]">
            Six tools, one crew
          </h2>
          <p className="mt-5 max-w-sm text-base leading-relaxed text-muted-foreground">
            A spec gets built the way a building does: one trade at a time,
            each with a tool that does exactly its job.
          </p>
        </div>

        <ul className="grid gap-0 border-t border-primary/25 sm:grid-cols-2 lg:grid-cols-3">
          {TOOLS.map((t, i) => (
            <li
              key={t.part}
              className="reveal-child group relative border-b border-primary/25 px-5 py-5 transition-colors duration-200 first:border-t-0 hover:bg-background/70 sm:odd:border-r lg:[&:nth-child(3n+1)]:border-r lg:[&:nth-child(3n+2)]:border-r"
              style={{ "--reveal-i": i + 1 } as CSSProperties}
            >
              {/* Corner ticks: tanda ukur gambar teknik */}
              <span aria-hidden className="absolute -left-px -top-px h-2.5 w-2.5 border-l border-t border-primary/60" />
              <span aria-hidden className="absolute -right-px -top-px h-2.5 w-2.5 border-r border-t border-primary/60" />
              <span aria-hidden className="absolute -bottom-px -right-px h-2.5 w-2.5 border-b border-r border-primary/60" />

              <div className="flex items-center justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-sm border border-primary/40 text-primary transition-colors duration-200 group-hover:border-[var(--hard-hat)] group-hover:bg-[var(--hard-hat)] group-hover:text-[var(--graphite)]">
                  <ToolIcon name={t.tool} className="h-5 w-5" />
                </span>
                <span className="font-mono text-[11px] tracking-[0.12em] text-muted-foreground">
                  {t.part}
                </span>
              </div>
              <h3 className="mt-4 font-heading text-base font-bold tracking-tight">
                {t.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {t.body}
              </p>
            </li>
          ))}
        </ul>
      </Reveal>
    </Section>
  );
}
