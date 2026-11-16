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
        "relative w-full px-6 py-24 md:px-10 md:py-32",
        tone === "surface" ? "bg-card" : "bg-background",
        className,
      )}
    >
      <div className="mx-auto w-full max-w-6xl">{children}</div>
    </section>
  );
}
