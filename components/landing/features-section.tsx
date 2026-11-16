import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Section } from "@/components/landing/section";

/**
 * FeaturesSection — grid fitur MVP sekunder (yang belum diangkat oleh
 * kartu hantu): workspace & editor, RAG knowledge, BYOK, export 5 format.
 * Satu array data, satu gaya kartu (DRY).
 */
const FEATURES = [
  {
    title: "Workspace built for 5–10",
    body: "Owner and member roles, invite links, and a flat document list with search and filters. No ceremony — just the team and its specs.",
    tag: "Collaboration",
  },
  {
    title: "Editor that remembers",
    body: "TipTap markdown with Mermaid diagrams rendered inline, autosave every second, and a soft lock so edits never collide.",
    tag: "Editor",
  },
  {
    title: "The workspace knows its own lore",
    body: "Every document is chunked and embedded. Ask what you decided in another spec — the assistant retrieves it from workspace knowledge.",
    tag: "RAG",
  },
  {
    title: "Bring your own key",
    body: "OpenAI, Anthropic, Gemini, or OpenRouter — your keys, encrypted server-side. Embeddings run locally in your browser, no key needed.",
    tag: "AI",
  },
] as const;

export function FeaturesSection() {
  return (
    <Section tone="surface">
      <h2 className="font-heading text-3xl font-semibold text-foreground md:text-5xl">
        Built for teams who write before they code
      </h2>
      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        {FEATURES.map((f) => (
          <Card
            key={f.title}
            className="border-border/50 bg-background/40 transition-colors hover:border-primary/40"
          >
            <CardContent className="flex h-full flex-col gap-3 p-6">
              <Badge
                variant="outline"
                className="w-fit border-primary/40 text-primary"
              >
                {f.tag}
              </Badge>
              <h3 className="font-heading text-lg font-semibold text-foreground">
                {f.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {f.body}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </Section>
  );
}
