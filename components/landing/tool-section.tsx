import { Reveal } from "@/components/landing/reveal";
import { Section } from "@/components/landing/section";
import { ToolIcon, type ToolName } from "@/components/landing/tool-kit";
import { ToolFigure, type ToolFigureName } from "@/components/figures/tools";

import type { CSSProperties } from "react";

/**
 * ToolSection — "The tool kit" in a bento-box layout.
 *
 * Desktop (lg+): 4-column asymmetric grid where cells span 1–2 columns/rows.
 * Each card is always filled — the isometric figure sits as a watermark
 * behind the title. On hover the figure brightens, the body text slides in,
 * and the card lifts with a cobalt shadow.
 *
 * The figure orbits slowly (azimuth spin) via the ToolFigure client component.
 */
const TOOLS: {
  tool: ToolName;
  figure: ToolFigureName;
  part: string;
  title: string;
  body: string;
}[] = [
  {
    tool: "clipboard",
    figure: "clipboard",
    part: "P-01",
    title: "Template sheets",
    body: "Every document starts from Spec, URS, Plan, Tasks, Diagram or Blank, and every one of them lands in the same flat list.",
  },
  {
    tool: "pencil",
    figure: "pencil",
    part: "P-02",
    title: "Assistant redlines",
    body: "The AI proposes edits as diff previews. You approve, reject or reshape each one before anything changes on the sheet.",
  },
  {
    tool: "wrench",
    figure: "wrench",
    part: "P-03",
    title: "Workspace knowledge",
    body: "Every autosaved document is chunked and embedded, so a question in one spec can be answered from another.",
  },
  {
    tool: "level",
    figure: "level",
    part: "P-04",
    title: "Single-writer lock",
    body: "One editor at a time. While you hold the sheet, everyone else reads it, so two edits never collide.",
  },
  {
    tool: "tape",
    figure: "tape",
    part: "P-05",
    title: "Import and export",
    body: "Bring in .md, .docx or a text PDF. Send the spec out as a prompt for Claude Code, Cursor, Copilot or Gemini CLI.",
  },
  {
    tool: "hammer",
    figure: "hammer",
    part: "P-06",
    title: "Your own key",
    body: "Connect OpenAI, Anthropic, Gemini or OpenRouter. The key stays encrypted on the server, and documents work without one.",
  },
];

export function ToolSection() {
  return (
    <Section id="tools" tone="panel" className="items-stretch">
      <Reveal className="grid gap-x-14 gap-y-10">
        {/* Section header */}
        <div
          className="reveal-child max-w-2xl"
          style={{ "--reveal-i": 0 } as CSSProperties}
        >
          <p className="type-label text-primary">The tool kit</p>
          <h2 className="type-section mt-4 text-[clamp(2rem,4.2vw,3.5rem)]">
            Six tools, one crew
          </h2>
          <p className="mt-5 max-w-sm text-base leading-relaxed text-muted-foreground">
            A spec gets built the way a building does: one trade at a time,
            each with a tool that does exactly its job.
            <span className="mt-1 block font-mono text-[11px] uppercase tracking-[0.12em] text-primary/60">
              Hover a tool to open it
            </span>
          </p>
        </div>

        {/* Bento grid */}
        <ul
          className="tool-bento reveal-child"
          style={{ "--reveal-i": 1 } as CSSProperties}
        >
          {TOOLS.map((t, i) => (
            <li key={t.part} className={`tool-card group/card${i === 2 || i === 3 ? " tool-card--small" : ""}`}>
              {/* Corner ticks — blueprint drawing marks */}
              <span
                aria-hidden
                className="pointer-events-none absolute -left-px -top-px z-10 h-2.5 w-2.5 border-l border-t border-primary/60"
              />
              <span
                aria-hidden
                className="pointer-events-none absolute -right-px -top-px z-10 h-2.5 w-2.5 border-r border-t border-primary/60"
              />
              <span
                aria-hidden
                className="pointer-events-none absolute -bottom-px -right-px z-10 h-2.5 w-2.5 border-b border-r border-primary/60"
              />

              {/* Isometric figure — faint watermark in idle, brightens on hover */}
              <div className="tool-card-figure">
                <ToolFigure name={t.figure} />
              </div>

              {/* Header: tool icon + part number */}
              <div className="tool-card-head">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border border-primary/40 text-primary transition-colors duration-200 group-hover/card:border-[var(--hard-hat)] group-hover/card:bg-[var(--hard-hat)] group-hover/card:text-[var(--graphite)]">
                  <ToolIcon name={t.tool} className="h-4 w-4" />
                </span>
                <span className="font-mono text-[10px] tracking-[0.12em] text-muted-foreground">
                  {t.part}
                </span>
              </div>

              {/* Footer: title always visible, body revealed on hover */}
              <div className="tool-card-foot">
                <h3
                  className="tool-card-title font-heading text-base text-foreground"
                >
                  {t.title}
                </h3>
                <p className="tool-card-body">{t.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </Reveal>
    </Section>
  );
}
