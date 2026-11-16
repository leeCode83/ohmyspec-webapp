import { cn } from "@/lib/utils";

import type { ReactNode } from "react";

/**
 * Section — wadah satu section landing (SRP: hanya layout, tidak tahu isi).
 * Satu section per layar: padding vertikal konsisten + `.wrap` dengan
 * edge kiri-kanan sama. `tone` mengatur latar: "night" (default, ground)
 * atau "surface" (biru gelap lebih terang, untuk memisahkan section).
 */
export function Section({
  children,
  className,
  tone = "night",
  id,
}: {
  children: ReactNode;
  className?: string;
  tone?: "night" | "surface";
  id?: string;
}) {
  return (
    <section
      id={id}
      className={cn(
        // min-h-screen: satu section per layar (gates screen-short/neighbour)
        "relative flex min-h-screen w-full items-center py-24 md:py-32",
        tone === "surface" ? "bg-card" : "bg-background",
        className,
      )}
    >
      <div className="wrap">{children}</div>
    </section>
  );
}
