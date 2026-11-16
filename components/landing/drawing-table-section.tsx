import { Reveal } from "@/components/landing/reveal";
import { Section } from "@/components/landing/section";
import { SpecBoard } from "@/components/landing/spec-board";

import type { CSSProperties } from "react";

/**
 * DrawingTableSection — "The drawing table": mock UI produk yang
 * sebenarnya di kiri (SpecBoard), daftar fakta kerja di kanan sebagai
 * bill-of-materials bertingkat (legenda + nomor + garis tipis). Menutup
 * celah "klaim tanpa visual produk".
 */
const NOTES = [
  {
    no: "N-01",
    title: "A workspace for 5 to 10 people",
    body: "Owner and member roles, invite links, and one flat document list with search and filter.",
  },
  {
    no: "N-02",
    title: "The editor never drops a draft",
    body: "Markdown autosaves every second, and Mermaid diagrams render inline while you write.",
  },
  {
    no: "N-03",
    title: "Ask the workspace, not the file",
    body: "Every document is chunked and embedded, so the assistant can quote another spec by section.",
  },
  {
    no: "N-04",
    title: "See what changes before it lands",
    body: "Every assistant edit arrives as a diff preview with Apply and Reject, and only you decide.",
  },
];

export function DrawingTableSection() {
  return (
    <Section id="table" tone="panel" className="items-stretch">
      <Reveal className="grid gap-10 lg:grid-cols-[1.25fr_0.85fr] lg:items-center">
        <div
          className="reveal-child relative"
          style={{ "--reveal-i": 0 } as CSSProperties}
        >
          {/* Label gambar di atas mock, seperti keterangan di atas lembar */}
          <p className="mb-3 flex items-baseline justify-between font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            <span className="text-primary">Fig 2 · Workspace view</span>
            <span>auth-service.spec.md</span>
          </p>
          <SpecBoard />
        </div>

        <div>
          <p
            className="reveal-child type-label text-primary"
            style={{ "--reveal-i": 1 } as CSSProperties}
          >
            The drawing table
          </p>
          <h2
            className="reveal-child type-section mt-4 text-[clamp(2rem,3.8vw,3rem)]"
            style={{ "--reveal-i": 2 } as CSSProperties}
          >
            Built for teams who draw before they build
          </h2>
          <ul className="mt-8 border-t border-primary/25">
            {NOTES.map((n, i) => (
              <li
                key={n.no}
                className="reveal-child grid grid-cols-[auto_1fr] gap-x-4 border-b border-primary/25 py-4"
                style={{ "--reveal-i": i + 3 } as CSSProperties}
              >
                <span className="pt-0.5 font-mono text-[11px] tracking-[0.1em] text-primary">
                  {n.no}
                </span>
                <div>
                  <h3 className="font-heading text-base font-bold tracking-tight">
                    {n.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {n.body}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </Section>
  );
}
