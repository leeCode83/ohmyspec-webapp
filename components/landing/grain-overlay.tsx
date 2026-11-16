import { cn } from "@/lib/utils";

/**
 * GrainOverlay — film grain di atas seluruh halaman (fixed, non-interaktif).
 * Noise dihasilkan dari satu data-URI SVG feTurbulence — tanpa file aset,
 * tanpa runtime JS. Opacity rendah agar teks tetap terbaca.
 */
const GRAIN_DATA_URI =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

export function GrainOverlay({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none fixed inset-0 z-50 opacity-[0.06] mix-blend-overlay",
        className,
      )}
      style={{ backgroundImage: GRAIN_DATA_URI }}
    />
  );
}
