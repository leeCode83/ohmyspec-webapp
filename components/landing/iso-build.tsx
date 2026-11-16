/**
 * IsoBuild — gambar isometrik bangunan dua lantai, stroke-only, yang
 * "menggambar dirinya sendiri" dari slab bawah ke atap lalu crane.
 *
 * Signature mechanic tema blueprint: tiap elemen berurutan naik pakai
 * `pathLength={1}` + `stroke-dasharray: 1` + `stroke-dashoffset: 1 → 0`
 * (utility `animate-draw`, delay inline mengikuti urutan konstruksi).
 * Garis dimensi kuning + label mono di atasnya mengunci rasa "gambar
 * teknik". Dekoratif saja: aria-hidden, reduced-motion = gambar utuh.
 */
const INK = "#1f2de6"; // cobalt — garis bangunan
const DIM = "#8a6a2a"; // teks dimensi di atas kertas
const HAT = "#e8a33d"; // kuning hard hat — satu elemen struktur kunci (crane hook)

type Part = { d: string; delay: number; width?: number; dashed?: boolean };

// Urutan konstruksi nyata: slab → kolom → plat lantai → dinding → atap → bukaan.
const PARTS: Part[] = [
  // Slab dasar (paralelogram isometrik)
  { d: "M60 300 L240 210 L420 300 L240 390 Z", delay: 0 },
  // Empat kolom dari sudut slab
  { d: "M60 300 L60 190", delay: 0.35 },
  { d: "M420 300 L420 190", delay: 0.35 },
  { d: "M240 390 L240 280", delay: 0.35 },
  { d: "M240 210 L240 100", delay: 0.35 },
  // Plat lantai dua
  { d: "M60 190 L240 100 L420 190 L240 280 Z", delay: 0.7 },
  // Dinding atas: vertikal + balok atas
  { d: "M60 190 L60 110 M420 190 L420 110 M240 280 L240 200", delay: 1.05 },
  // Ridge atap
  { d: "M60 110 L240 20 L420 110", delay: 1.4 },
  // Atap miring: dua bidang
  { d: "M60 110 L240 110 M420 110 L240 110", delay: 1.4, dashed: true },
  // Bukaan lantai dasar: pintu + dua jendela
  { d: "M215 355 L215 320 L245 335 L245 370 Z", delay: 1.75 },
  { d: "M330 330 L330 300 L360 315 L360 345 Z", delay: 1.75 },
  { d: "M150 330 L150 300 L180 315 L180 345 Z", delay: 1.75 },
  // Jendela lantai atas
  { d: "M330 215 L330 185 L360 200 L360 230 Z", delay: 1.75 },
  { d: "M150 215 L150 185 L180 200 L180 230 Z", delay: 1.75 },
];

// Garis & label dimensi (digambar terakhir, seperti anotasi pada gambar)
const DIMS: Part[] = [
  // Lebar bawah 24.0 m
  { d: "M60 320 L240 410 L420 320", delay: 2.1, width: 0.8 },
  // Tinggi kolom kanan 8.4 m
  { d: "M452 300 L452 190", delay: 2.3, width: 0.8 },
  // Kedalaman atas
  { d: "M60 190 L240 100", delay: 2.3, width: 0.8 },
];

// Crane menara kecil di kiri atas
const CRANE: Part[] = [
  { d: "M30 300 L30 60 M30 60 L165 60 M30 60 L-5 75 M150 60 L150 95 M30 60 L30 45", delay: 1.6, dashed: false },
  { d: "M30 300 L55 300 M30 275 L50 275 M30 250 L50 250 M30 225 L50 225", delay: 1.9 },
];

export function IsoBuild({ className }: { className?: string }) {
  return (
    <div className={className}>
      <svg
        aria-hidden
        viewBox="-30 -10 520 440"
        fill="none"
        className="h-auto w-full"
        role="presentation"
      >
        {/* Grid bantu isometrik: tipis, paling belakang */}
        <g stroke={INK} strokeOpacity="0.12" strokeWidth="0.6">
          {Array.from({ length: 13 }, (_, i) => (
            <line key={`a${i}`} x1={-20 + i * 40} y1="430" x2={-20 + i * 40 + 180} y2="70" />
          ))}
          {Array.from({ length: 9 }, (_, i) => (
            <line key={`b${i}`} x1={-20} y1={410 - i * 40} x2={500} y2={410 - i * 40} />
          ))}
        </g>

        {/* Bangunan: urutan konstruksi */}
        <g stroke={INK} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          {[...PARTS, ...CRANE].map((p, i) => (
            <path
              key={i}
              d={p.d}
              pathLength={1}
              strokeDasharray={p.dashed ? "0.04 0.03" : undefined}
              className="animate-draw"
              style={{ animationDelay: `${p.delay}s` }}
            />
          ))}
        </g>

        {/* Konter jendela: sedikit isi kuning agar terasa "Bob", bukan CAD kering */}
        <g fill={HAT} fillOpacity="0.75" className="animate-sheet-in" style={{ animationDelay: "2.5s" }}>
          <path d="M332 217 L332 187 L358 201 L358 231 Z" />
        </g>

        {/* Hook crane: satu aksen kuning */}
        <g className="animate-sheet-in" style={{ animationDelay: "2.3s" }}>
          <circle cx="150" cy="118" r="4" fill={HAT} />
          <path d="M150 95 L150 108" stroke={INK} strokeWidth="1.2" />
        </g>

        {/* Dimensi + label */}
        <g
          stroke={DIM}
          strokeWidth="0.9"
          strokeLinecap="round"
          className="animate-draw"
          style={{ animationDelay: "2.1s" }}
        >
          {DIMS.map((p, i) => (
            <path
              key={i}
              d={p.d}
              pathLength={1}
              className="animate-draw"
              style={{ animationDelay: `${p.delay}s` }}
            />
          ))}
          {/* Tanda panah ujung dimensi */}
          <path d="M60 320 L66 317 M60 320 L61 326 M420 320 L414 317 M420 320 L419 326" style={{ animationDelay: "2.4s" }} />
          <path d="M452 300 L449 295 M452 300 L455 295 M452 190 L449 195 M452 190 L455 195" style={{ animationDelay: "2.4s" }} />
        </g>
        <g
          fill={DIM}
          fontFamily="var(--font-geist-mono), monospace"
          fontSize="11"
          className="animate-sheet-in"
          style={{ animationDelay: "2.6s" }}
        >
          <text x="225" y="425" textAnchor="middle">
            24.0 m
          </text>
          <text x="462" y="249">
            8.4 m
          </text>
          <text x="175" y="140" textAnchor="middle" transform="rotate(-26 175 140)">
            DEPTH 12.0
          </text>
          {/* Label sheet di pojok */}
          <text x="-24" y="428" fontSize="10" letterSpacing="1.5">
            FIG 1 · SECTION A-A · 1:100
          </text>
        </g>
      </svg>
    </div>
  );
}
