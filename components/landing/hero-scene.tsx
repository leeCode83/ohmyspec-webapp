/**
 * HeroScene — lapisan animasi horror hero (berjalan terus, murni CSS):
 * 1. Moon breathing + flicker lampu minyak (siklus 9s / flicker 11s).
 * 2. Kuntilanak materialize perlahan (8s) lalu sway halus;
 *    mata crimson menyala sekejap tiap siklus 14s — satu-satunya
 *    momen crimson, "dia melihatmu".
 * 3. Kembang tujuh rupa: 5 petal kamboja jatuh dengan durasi/delay beda.
 * Semua aria-hidden, pointer-events-none, dan aman prefers-reduced-motion
 * (animasi berhenti, konten tetap terlihat — lihat guard di globals.css).
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
      {/* Bulan purnama: breathing + sesekali flicker seperti lampu kena angin */}
      <div className="absolute right-[12%] top-[14%] md:right-[18%]">
        <img
          src="/horror/moon.svg"
          alt=""
          className="animate-moon h-28 w-28 rounded-full md:h-40 md:w-40"
          style={{
            filter: "drop-shadow(0 0 40px rgba(238,226,190,0.55))",
            animation: "moon-breathe 9s ease-in-out infinite",
          }}
        />
        {/* Halo flicker di sekeliling bulan */}
        <div
          className="absolute inset-[-40%] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(232,180,74,0.18) 0%, transparent 70%)",
            animation: "lamp-flicker 11s linear infinite",
          }}
        />
      </div>

      {/* Kuntilanak: materialize pelan, sway, mata crimson menyala sekejap */}
      <div
        className="absolute bottom-[14%] left-[10%] w-28 opacity-0 md:left-[16%] md:w-40"
        style={{
          color: "#030a12",
          // Materialize sekali (forwards), lalu sway terus-menerus berjalan paralel
          animation:
            "materialize 8s ease-out 1s forwards, sway 7s ease-in-out 9s infinite",
        }}
      >
        <img src="/horror/kuntilanak.svg" alt="" className="h-auto w-full" />
        {/* Mata: glow crimson tiap siklus 14s (92-97% dari keyframes) */}
        <span
          className="eye-glow absolute right-[62%] top-[9%] h-1 w-1 rounded-full md:h-1.5 md:w-1.5"
          style={{
            background: "var(--crimson)",
            boxShadow: "0 0 8px 2px rgba(176,58,58,0.8)",
            animation: "eye-glow 14s linear infinite",
            opacity: 0,
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
