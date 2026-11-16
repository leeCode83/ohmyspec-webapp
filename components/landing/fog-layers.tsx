/**
 * FogLayers — tiga lapis kabut SVG yang bergerak horizontal dengan
 * kecepatan/arah berbeda (parallax murni CSS, tanpa JS).
 *
 * Wrapper WAJIB punya tinggi (mis. `h-56`); sebelumnya wrapper absolute
 * tanpa tinggi membuat gambar fog ter-render 0px (bug temuan critique).
 * Server component; animasi via keyframes `animate-fog` di globals.css.
 */
export function FogLayers({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-x-0 bottom-0 h-48 overflow-hidden md:h-64 ${className ?? ""}`}
    >
      {/* Lapis jauh: paling pelan & pudar */}
      <img
        src="/horror/fog.svg"
        alt=""
        className="animate-fog absolute bottom-0 left-[-20%] h-[70%] w-[140%] object-cover opacity-40 blur-md"
        style={{ animationDuration: "60s" }}
      />
      {/* Lapis tengah */}
      <img
        src="/horror/fog.svg"
        alt=""
        className="animate-fog absolute bottom-[8%] left-[-15%] h-[55%] w-[130%] object-cover opacity-35 blur-sm"
        style={{ animationDuration: "45s", animationDirection: "alternate-reverse" }}
      />
      {/* Lapis dekat: paling cepat & jelas */}
      <img
        src="/horror/fog.svg"
        alt=""
        className="animate-fog absolute bottom-[14%] left-[-10%] h-[40%] w-[120%] object-cover opacity-30"
        style={{ animationDuration: "32s" }}
      />
    </div>
  );
}
