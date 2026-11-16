/**
 * FogLayers — 3 lapis kabut SVG yang bergerak horizontal dengan
 * kecepatan/arah berbeda (parallax murni CSS, tanpa JS).
 * Server component; animasi via keyframes `animate-fog` di globals.css.
 */
export function FogLayers({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-x-0 bottom-0 overflow-hidden ${className ?? ""}`}
    >
      {/* Lapis jauh: paling pelan & pudar */}
      <img
        src="/horror/fog.svg"
        alt=""
        className="animate-fog absolute bottom-0 left-[-20%] h-[55%] w-[140%] object-cover opacity-30 blur-md"
        style={{ animationDuration: "60s" }}
      />
      {/* Lapis tengah */}
      <img
        src="/horror/fog.svg"
        alt=""
        className="animate-fog absolute bottom-[8%] left-[-15%] h-[45%] w-[130%] object-cover opacity-25 blur-sm"
        style={{ animationDuration: "45s", animationDirection: "alternate-reverse" }}
      />
      {/* Lapis dekat: paling cepat & jelas */}
      <img
        src="/horror/fog.svg"
        alt=""
        className="animate-fog absolute bottom-[16%] left-[-10%] h-[35%] w-[120%] object-cover opacity-20"
        style={{ animationDuration: "32s" }}
      />
    </div>
  );
}
