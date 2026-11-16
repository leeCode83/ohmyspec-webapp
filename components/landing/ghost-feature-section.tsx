import Image from "next/image";

import { Card, CardContent } from "@/components/ui/card";
import { Section } from "@/components/landing/section";

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
  // Spread asimetris: Kuntilanak (maskot) jadi kartu unggulan besar,
  // lima sisanya kartu kecil. Komposisi sengaja berbeda dari grid seragam
  // section lain (temuan critique: "satu template diulang 3x").
  const [lead, ...rest] = GHOSTS;

  return (
    <Section id="ghosts" tone="surface" className="items-stretch">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        {/* Kolom kiri: heading + kartu unggulan raksasa */}
        <div className="flex flex-col gap-8">
          <div>
            <p className="type-section text-sm uppercase tracking-[0.22em] text-primary/80">
              The haunts
            </p>
            <h2 className="type-section mt-3 text-[clamp(2rem,4.5vw,3.75rem)] text-foreground">
              Six haunts,
              <br />
              six features
            </h2>
            <p className="mt-4 max-w-md text-muted-foreground">
              Every feature in OhmySpec has a ghost from Indonesian folklore
              behind it. Each one has a job, and so does each feature.
            </p>
          </div>

          {/* Kartu unggulan: siluet setinggi poster, ornamen ring emas */}
          <Card className="group relative overflow-hidden border-primary/20 bg-[#0d1824]">
            <div
              aria-hidden
              className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(232,180,74,0.16),transparent_60%)]"
            />
            <CardContent className="relative grid gap-6 p-6 sm:grid-cols-[auto_1fr] sm:items-end">
              <div className="relative flex h-56 items-end justify-center">
                <Image
                  src={lead.src}
                  alt=""
                  width={lead.width}
                  height={lead.height}
                  className="h-full w-auto object-contain text-[#cfd8e3] transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <span className="absolute -bottom-1 left-1/2 h-px w-24 -translate-x-1/2 bg-primary/50" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-primary">
                  The face of OhmySpec
                </p>
                <h3 className="type-ghost mt-2 text-3xl text-foreground">
                  {lead.name}
                </h3>
                <p className="mt-1 text-sm italic text-muted-foreground">
                  {lead.lore}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-foreground/90">
                  {lead.feature}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Kolom kanan: lima hantu kecil dalam daftar bergaris, bukan grid */}
        <ul className="divide-y divide-border/40 border-y border-border/40">
          {rest.map((ghost) => (
            <li
              key={ghost.name}
              className="group flex items-center gap-5 py-5 transition-colors hover:bg-primary/[0.04]"
            >
              <div className="flex h-20 w-16 shrink-0 items-end justify-center">
                <Image
                  src={ghost.src}
                  alt=""
                  width={ghost.width}
                  height={ghost.height}
                  className="max-h-20 w-auto object-contain text-[#9fb0c2] transition-transform duration-300 group-hover:-translate-y-1"
                />
              </div>
              <div className="min-w-0">
                <h3 className="type-ghost text-lg text-foreground">
                  {ghost.name}
                </h3>
                <p className="text-xs italic text-muted-foreground">
                  {ghost.lore}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-foreground/85">
                  {ghost.feature}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
