import { SpecMock } from "@/components/landing/spec-mock";
import { Section } from "@/components/landing/section";

/**
 * FeaturesSection — split section: mock produk di kiri, daftar fitur di
 * kanan. Menutup temuan "klaim tanpa visual produk": pengunjung melihat
 * editor, diff preview, dan knowledge panel sebelum daftar fitur.
 */
const FEATURES = [
  {
    title: "A workspace for 5 to 10 people",
    body: "Owner and member roles, invite links, and a flat document list with search and filters.",
  },
  {
    title: "An editor that never drops a draft",
    body: "TipTap markdown renders Mermaid diagrams inline and autosaves every second.",
  },
  {
    title: "Ask your workspace what it decided",
    body: "Every document is chunked and embedded, so the assistant can quote another spec.",
  },
  {
    title: "Bring your own key",
    body: "Your OpenAI, Anthropic, Gemini, or OpenRouter key stays encrypted server-side.",
  },
] as const;

export function FeaturesSection() {
  return (
    <Section tone="surface" className="items-stretch">
      <div className="grid gap-12 lg:grid-cols-[1.25fr_0.75fr] lg:items-center">
        <div className="order-2 lg:order-1">
          <SpecMock />
        </div>

        <div className="order-1 lg:order-2">
          <p className="type-section text-sm uppercase tracking-[0.22em] text-primary/80">
            Inside the workspace
          </p>
          <h2 className="type-section mt-3 text-[clamp(2rem,4vw,3.25rem)] text-foreground">
            Built for teams who write before they code
          </h2>

          {/* Daftar fitur bergaris: hirarki lewat nomor, bukan kartu */}
          <ul className="mt-8 divide-y divide-border/40 border-t border-border/40">
            {FEATURES.map((f, i) => (
              <li key={f.title} className="flex gap-4 py-5">
                <span className="type-ghost w-6 shrink-0 text-sm text-primary/70">
                  0{i + 1}
                </span>
                <div>
                  <h3 className="type-ghost text-base text-foreground">
                    {f.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {f.body}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
