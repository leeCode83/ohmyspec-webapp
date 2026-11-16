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
    title: "A workspace for 5 to 10 people",
    body: "Owner and member roles, invite links, and a flat document list with search and filters. The whole team and its specs, nothing else.",
    tag: "Collaboration",
  },
  {
    title: "An editor that never drops a draft",
    body: "TipTap markdown renders Mermaid diagrams inline, autosave runs every second, and a soft lock keeps edits from colliding.",
    tag: "Editor",
  },
  {
    title: "Ask your workspace what it decided",
    body: "Every document is chunked and embedded. Ask what you decided in another spec, and the assistant retrieves it from workspace knowledge.",
    tag: "RAG",
  },
  {
    title: "Bring your own key",
    body: "Your OpenAI, Anthropic, Gemini, or OpenRouter key stays encrypted server-side. Embeddings run locally in your browser and need no key.",
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
