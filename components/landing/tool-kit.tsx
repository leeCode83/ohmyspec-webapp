/**
 * tool-kit — ikon garis perkakas kerja (stroke-only, 24×24, konsisten
 * dengan garis blueprint). Ditarik manual sebagai path kecil, bukan aset
 * eksternal, supaya warna bisa mengikuti token (currentColor).
 */
const TOOLS = {
  /** Palu: kepala + gagang */
  hammer: "M3 21l7.5-7.5 M13.5 3.5l7 7-3.5 1.5-4.5-4.5z M12 6l-1.5-1.5 3-3 1.5 1.5",
  /** Pita ukur: casing + strip keluar + ujung */
  tape:
    "M3 9a6 6 0 0 1 12 0v6a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3z M15 10h5l2 2 M6 9h.01 M9 9h.01 M12 9h.01",
  /** Kunci pas: kepala terbuka + tangkai */
  wrench:
    "M20.5 3.5a5.5 5.5 0 0 1-7 7L6 18a2.1 2.1 0 1 1-3-3l7.5-7.5a5.5 5.5 0 0 1 7-7z M15.5 8.5l.01.01",
  /** Pensil merah (redline): pensil + ujung */
  pencil:
    "M17 3.5l3.5 3.5L8 19.5l-4.5 1L4.5 16z M14.5 6l3.5 3.5 M3 22h18",
  /** Level (waterpass): badan + tabung gelembung */
  level: "M2 10h20v4H2z M6 12h3 M10 12h4 M12 9.5v5",
  /** Papan klip: papan + kertas + penjepit */
  clipboard:
    "M9 3h6a1 1 0 0 1 1 1v1H8V4a1 1 0 0 1 1-1z M8 5H5v16h14V5h-3 M9 11h6 M9 15h4",
} as const;

export type ToolName = keyof typeof TOOLS;

export function ToolIcon({
  name,
  className,
}: {
  name: ToolName;
  className?: string;
}) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d={TOOLS[name]} />
    </svg>
  );
}
