/**
 * IsoBuild — gambar isometrik bangunan dua lantai, stroke-only, yang
 * "menggambar dirinya sendiri" dari slab dasar sampai atap lalu anotasi.
 *
 * Signature mechanic tema blueprint: tiap elemen pakai `pathLength={1}` +
 * `stroke-dasharray: 1` + `stroke-dashoffset: 1 → 0` (utility `animate-draw`,
 * delay inline mengikuti urutan konstruksi nyata). Garis dimensi emas +
 * label mono mengunci rasa "gambar teknik"; jendela satu terisi kuning
 * hard hat sebagai aksen Bob. Dekoratif: aria-hidden, reduced-motion =
 * gambar utuh.
 */
const INK = "#1f2de6"; // cobalt — garis bangunan
const DIM = "#8a6a2a"; // teks dimensi di atas kertas
const HAT = "#e8a33d"; // kuning hard hat — satu aksen isi

type Part = { d: string; delay: number; dash?: string };

// Urutan konstruksi: slab → kolom → plat → dinding → atap → bukaan.
const PARTS: Part[] = [
  { d: "M60 300 L240 210 L420 300 L240 390 Z", delay: 0 }, // slab dasar
  { d: "M60 300 L60 190 M420 300 L420 190", delay: 0.35 }, // kolom depan
  { d: "M240 390 L240 280 M240 210 L240 100", delay: 0.35 }, // kolom tengah
  { d: "M60 190 L240 100 L420 190 L240 280 Z", delay: 0.7 }, // plat lantai 2
  { d: "M60 190 L60 110 M420 190 L420 110 M240 280 L240 200", delay: 1.0 }, // dinding atas
  { d: "M60 110 L240 20 L420 110", delay: 1.3 }, // ridge atap
  { d: "M60 110 L240 110 L420 110", delay: 1.3, dash: "0.03 0.025" }, // garis ridge bawah (putus)
  { d: "M150 330 L150 295 L180 311 L180 346 Z M330 330 L330 295 L360 311 L360 346 Z", delay: 1.6 }, // jendela bawah
  { d: "M150 215 L150 180 L180 196 L180 231 Z M330 215 L330 180 L360 196 L360 231 Z", delay: 1.6 }, // jendela atas
];

// Anotasi: garis dimensi digambar terakhir, seperti pada lembar gambar asli.
const DIMS: Part[] = [
  { d: "M60 320 L240 410 L420 320", delay: 2.0 }, // lebar 24.0 m
  { d: "M452 300 L452 190", delay: 2.1 }, // tinggi 8.4 m
  { d: "M60 190 L240 100", delay: 2.1 }, // kedalaman 12.0 m
];

// Tower crane mini di kiri atas: mast, jib, counter-jib, kabel, hook.
const CRANE: Part[] = [
  { d: "M30 300 L30 60 M30 60 L165 60 M30 60 L-5 76 M150 60 L150 96", delay: 1.0 },
  { d: "M30 300 L52 300 M30 272 L52 272 M30 244 L52 244 M30 216 L52 216", delay: 1.3 },
];

const arrow = (x: number, y: number, dx: number, dy: number) =>
  `M${x} ${y} L${x - dx * 5} ${y - dy * 2} M${x} ${y} L${x + dx * 2} ${y - dy * 5}`;

export function IsoBuild({ className }: { className?: string }) {
  return (
    <div className={className}>
      <svg
        aria-hidden
        viewBox="-30 0 520 445"
        fill="none"
        className="h-auto w-full"
        role="presentation"
      >
        {/* Grid bantu isometrik: tipis, paling belakang */}
        <g stroke={INK} strokeOpacity="0.1" strokeWidth="0.6">
          {Array.from({ length: 12 }, (_, i) => (
            <line key={`a${i}`} x1={-20 + i * 40} y1="400" x2={-20 + i * 40 + 120} y2="280" />
          ))}
        </g>

        {/* Bangunan + crane: urutan konstruksi */}
        <g stroke={INK} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          {[...PARTS, ...CRANE].map((p, i) => (
            <path
              key={i}
              d={p.d}
              pathLength={1}
              strokeDasharray={p.dash}
              className="animate-draw"
              style={{ animationDelay: `${p.delay}s` }}
            />
          ))}
        </g>

        {/* Jendela lantai atas: satu terisi kuning hard hat */}
        <path
          d="M330 215 L330 180 L360 196 L360 231 Z"
          fill={HAT}
          className="animate-sheet-in"
          style={{ animationDelay: "2.2s" }}
        />

        {/* Hook crane (aksen kuning kedua) */}
        <g className="animate-sheet-in" style={{ animationDelay: "2.2s" }}>
          <circle cx="150" cy="116" r="3.5" fill={HAT} />
          <path d="M150 96 L150 108" stroke={INK} strokeWidth="1.1" />
        </g>

        {/* Garis dimensi + panah ujung */}
        <g stroke={DIM} strokeWidth="0.9" strokeLinecap="round">
          {DIMS.map((p, i) => (
            <path
              key={i}
              d={p.d}
              pathLength={1}
              className="animate-draw"
              style={{ animationDelay: `${p.delay}s` }}
            />
          ))}
          <path
            d={[arrow(60, 320, 0, 1), arrow(420, 320, 0, 1), arrow(452, 300, 1, 0), arrow(452, 190, 1, 0)].join(" ")}
            pathLength={1}
            className="animate-draw"
            style={{ animationDelay: "2.4s" }}
          />
        </g>

        {/* Label mono: ukuran + keterangan sheet */}
        <g
          fill={DIM}
          fontFamily="var(--font-geist-mono), monospace"
          className="animate-sheet-in"
          style={{ animationDelay: "2.5s" }}
        >
          <text x="240" y="432" fontSize="11" textAnchor="middle">
            24.0 m
          </text>
          <text x="462" y="249" fontSize="11">
            8.4 m
          </text>
          <text x="182" y="150" fontSize="10" textAnchor="middle" transform="rotate(-26 182 150)">
            12.0 m
          </text>
          <text x="-26" y="438" fontSize="10" letterSpacing="1.5">
            FIG 1 · SECTION A-A · 1:100
          </text>
        </g>
      </svg>
    </div>
  );
}
