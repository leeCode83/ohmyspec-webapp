/**
 * HeroScene — komposisi poster horor Indonesia untuk layar pertama:
 * 1. Bulan purnama (kanan atas) yang bernapas + flicker lampu minyak.
 * 2. Kuntilanak cut-out di kiri, materialize perlahan lalu sway; mata
 *    crimson menyala sekejap tiap siklus 14s dan juga saat di-hover.
 * 3. Kembang tujuh rupa: petal kamboja jatuh dengan durasi beda.
 * 4. Kegelapan tepi (vignette) untuk mood "terkendali".
 * Semua aria-hidden, pointer-events-none; prefers-reduced-motion aman
 * (lihat guard di globals.css).
 */
const PETALS = [
  { left: "8%", duration: "26s", delay: "0s", size: 22 },
  { left: "24%", duration: "34s", delay: "6s", size: 16 },
  { left: "52%", duration: "30s", delay: "12s", size: 20 },
  { left: "74%", duration: "38s", delay: "3s", size: 14 },
  { left: "90%", duration: "28s", delay: "18s", size: 18 },
] as const;

export function HeroScene() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Vignette: tepi gelap, pusat tetap terbaca */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,transparent_35%,rgba(2,6,10,0.85)_100%)]" />

      {/* Bulan purnama: breathing + sesekali flicker seperti lampu kena angin */}
      <div className="absolute right-[10%] top-[10%] md:right-[14%] md:top-[12%]">
        <img
          src="/horror/moon.svg"
          alt=""
          className="h-32 w-32 rounded-full md:h-60 md:w-60"
          style={{
            filter:
              "drop-shadow(0 0 60px rgba(238,226,190,0.45)) drop-shadow(0 0 120px rgba(232,180,74,0.18))",
            animation: "moon-breathe 9s ease-in-out infinite",
          }}
        />
        {/* Halo flicker: lebih lebar, menyatu ke kegelapan */}
        <div
          className="absolute inset-[-70%] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(232,180,74,0.16) 0%, rgba(232,180,74,0.04) 45%, transparent 70%)",
            animation: "lamp-flicker 11s linear infinite",
          }}
        />
      </div>

      {/* Kuntilanak poster: materialize pelan, lalu sway; mata menyala saat hover */}
      <div
        className="group absolute bottom-0 left-[2%] w-[220px] opacity-0 md:left-[7%] md:w-[340px] lg:w-[380px]"
        style={{
          animation:
            "materialize 9s ease-out 0.8s forwards, sway 8s ease-in-out 10s infinite",
        }}
      >
        <img
          src="/horror/kuntilanak-poster.svg"
          alt=""
          className="h-auto w-full translate-y-[6%] drop-shadow-[0_0_40px_rgba(232,180,74,0.08)]"
        />
        {/* Mata: menyala tiap 14s (keyframes) atau langsung saat hover */}
        <span
          className="eye-glow absolute left-[41%] top-[14.5%] h-2 w-8 rounded-full opacity-0 transition-opacity group-hover:opacity-100 md:top-[14%]"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(176,58,58,0.95) 0%, transparent 70%)",
            animation: "eye-glow 14s linear infinite",
          }}
        />
      </div>

      {/* Kembang tujuh rupa: petal kamboja melayang turun */}
      {PETALS.map((p, i) => (
        <img
          key={i}
          src="/horror/petal.svg"
          alt=""
          className="absolute top-0 text-[#efe4c8]"
          style={{
            left: p.left,
            width: p.size,
            opacity: 0,
            animation: `petal-fall ${p.duration} linear ${p.delay} infinite`,
          }}
        />
      ))}
    </div>
  );
}
