import Image from "next/image";

import { Card, CardContent } from "@/components/ui/card";
import { Section } from "@/components/landing/section";
import { cn } from "@/lib/utils";

/**
 * GhostFeatureSection — pemetaan hantu → fitur MVP (PRD §2).
 * Data array tunggal (DRY): tiap kartu = satu hantu dengan lore singkat
 * dan fitur OhmySpec yang diwakilinya. Siluet SVG pakai next/image untuk
 * lazy-load otomatis di bawah fold.
 */

type Ghost = {
  name: string;
  lore: string;
  feature: string;
  /** Lebar tampilan siluet (SVG berbeda rasio antar hantu) */
  width: number;
  height: number;
  src: string;
};

const GHOSTS: Ghost[] = [
  {
    name: "Kuntilanak",
    lore: "The icon. Her laugh warns you before disaster strikes.",
    feature: "The face of OhmySpec, and your warning before an ambiguous spec ships.",
    width: 200,
    height: 300,
    src: "/horror/kuntilanak.svg",
  },
  {
    name: "Tuyul",
    lore: "Works quietly for its master. Honestly eats your coins.",
    feature: "The AI assistant. It drafts and edits in silence, and it eats your BYOK tokens.",
    width: 200,
    height: 260,
    src: "/horror/tuyul.svg",
  },
  {
    name: "Pocong",
    lore: "Bound by an unfulfilled vow, it cannot rest.",
    feature: "A spec left unfinished haunts the workspace. The trash view is its graveyard.",
    width: 200,
    height: 300,
    src: "/horror/pocong.svg",
  },
  {
    name: "Genderuwo",
    lore: "The heavy laborer of the spirit world.",
    feature: "It carries the heavy jobs: imports, file conversions, and RAG indexing.",
    width: 260,
    height: 300,
    src: "/horror/genderuwo.svg",
  },
  {
    name: "Wewe Gombel",
    lore: "She adopts the children nobody cares for.",
    feature: "Neglected documents end up under her wing until someone claims them.",
    width: 220,
    height: 300,
    src: "/horror/wewe-gombel.svg",
  },
  {
    name: "Leak",
    lore: "A flying head, its entrails trailing behind.",
    feature: "Export prompt: the spec (the head) flies to your coding agent with its context (the entrails) trailing behind.",
    width: 300,
    height: 260,
    src: "/horror/leak.svg",
  },
];

export function GhostFeatureSection() {
  return (
    <Section id="ghosts" tone="surface">
      <h2 className="font-heading text-3xl font-semibold text-foreground md:text-5xl">
        Six haunts, six features
      </h2>
      <p className="mt-4 max-w-2xl text-muted-foreground">
        Every feature in OhmySpec has a ghost from Indonesian folklore behind
        it. Each one has a job, and so does each feature.
      </p>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {GHOSTS.map((ghost) => (
          <Card
            key={ghost.name}
            className="group overflow-hidden border-border/50 bg-background/40 transition-transform duration-200 hover:-translate-y-0.5 hover:border-primary/40"
          >
            <CardContent className="flex h-full flex-col gap-4 p-6">
              {/* Siluet: menggelap saat idle, menyala saat hover */}
              <div className="flex h-36 items-center justify-center overflow-hidden">
                <Image
                  src={ghost.src}
                  alt=""
                  width={ghost.width}
                  height={ghost.height}
                  className={cn(
                    "max-h-36 w-auto object-contain text-[#1d2c3d] transition-all duration-300",
                    "group-hover:scale-[1.03] group-hover:brightness-[2.2]",
                  )}
                  style={{
                    filter: "invert(1) opacity(0.35)",
                  }}
                />
              </div>
              <div>
                <h3 className="font-heading text-xl font-semibold text-foreground">
                  {ghost.name}
                </h3>
                <p className="mt-1 text-sm italic text-muted-foreground">
                  {ghost.lore}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-foreground/90">
                  {ghost.feature}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </Section>
  );
}
