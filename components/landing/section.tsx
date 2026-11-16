import { cn } from "@/lib/utils";

import type { ReactNode } from "react";

/**
 * Section — wadah satu section landing (SRP: hanya layout, tidak tahu isi).
 * Satu section per layar: padding vertikal konsisten + `.wrap` dengan
 * edge kiri-kanan sama. `tone` mengatur latar: "sheet" (default, kertas
 * bergaris) atau "panel" (kertas lebih gelap untuk memisahkan section).
 */
export function Section({
  children,
  className,
  tone = "sheet",
  id,
}: {
  children: ReactNode;
  className?: string;
  tone?: "sheet" | "panel";
  id?: string;
}) {
  return (
    <section
      id={id}
      className={cn(
        "relative flex min-h-[calc(100svh-4rem)] w-full items-center py-24 md:py-32",
        tone === "panel" && "bg-card",
        className,
      )}
    >
      <div className="wrap">{children}</div>
    </section>
  );
}
