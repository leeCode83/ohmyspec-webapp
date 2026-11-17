/**
 * art.tsx — Server component for the flatbed plotter figure.
 *
 * Builds all static JSX parts at server render time and passes them as
 * element props to the "use client" PlotterLive component.
 * No "use client" here — this runs on the server only.
 *
 * Painter's order (back → front):
 *   table → rail-X-back → paper → rail-Y → carriage (body) →
 *   head (housing/arm) → cables → pen (lit, rebuilt per frame) →
 *   rail-X end-stops front → power button
 */
import "./plotter.css";
import { Solid, Line, Dots, FaceText } from "@/components/iso/react/draw";
import {
  TABLE_ART,
  RAIL_X_ART,
  RAIL_Y_ART,
  PAPER_ART,
  CARRIAGE_ART,
  HEAD_ART,
} from "./geometry";
import { REST_FRAME } from "./frame";
import { PlotterLive } from "./live";

// ─── Static JSX groups ────────────────────────────────────────────────────────
// Every root element has a stable key to prevent React's large-page warning.

const TABLE = (
  <g key="table">
    <path className="iso-halo" d={TABLE_ART.halo} />
    {TABLE_ART.feet.map(([flange, shaft], i) => (
      <g key={i}>
        <Solid paths={flange} tone="lo" crease="faint" />
        <Solid paths={shaft} tone="mid" crease="faint" />
      </g>
    ))}
    <Solid paths={TABLE_ART.slab} tone="mid" crease="faint" />
    <Line d={TABLE_ART.seam} tone="lo" />
    <Line d={TABLE_ART.rulerX.minor} tone="lo" />
    <Line d={TABLE_ART.rulerX.major} tone="mid" />
    <Line d={TABLE_ART.rulerY.minor} tone="lo" />
    <Line d={TABLE_ART.rulerY.major} tone="mid" />
    <Dots points={TABLE_ART.screws} size={0.55} tone="mid" />
    <Solid paths={TABLE_ART.labelPlate} tone="lo" crease="none" flat />
    <Line d={TABLE_ART.labelLine} tone="faint" />
    <FaceText transform={TABLE_ART.labelTransform} size={2.4} tone="lo">
      PLTR-01
    </FaceText>
  </g>
);

const RAIL_X_BACK = (
  <g key="rail-x-back">
    <Solid paths={RAIL_X_ART.beam} tone="mid" crease="faint" />
    <Line d={RAIL_X_ART.seam} tone="faint" />
    <Line d={RAIL_X_ART.rulerMinor} tone="lo" />
    <Line d={RAIL_X_ART.rulerMajor} tone="mid" />
    {RAIL_X_ART.bushings.map((paths, i) => (
      <Solid key={i} paths={paths} tone="mid" crease="faint" />
    ))}
    <Dots points={RAIL_X_ART.bolts} size={0.6} tone="hi" />
  </g>
);

const PAPER = (
  <g key="paper">
    <Solid paths={PAPER_ART.slab} tone="lo" crease="none" flat />
    <Line d={PAPER_ART.seam} tone="faint" />
    <line
      className="iso-line pt-paper-grid"
      style={{ stroke: "var(--cobalt)", strokeOpacity: 0.1 }}
    />
    <Line d={PAPER_ART.gridH} tone="faint" />
    <Line d={PAPER_ART.gridV} tone="faint" />
    {PAPER_ART.clamps.map((paths, i) => (
      <Solid key={i} paths={paths} tone="mid" crease="faint" />
    ))}
  </g>
);

const RAIL_Y = (
  <g key="rail-y">
    <Solid paths={RAIL_Y_ART.beam} tone="mid" crease="faint" />
    <Line d={RAIL_Y_ART.seam} tone="faint" />
    <Solid paths={RAIL_Y_ART.stopBack} tone="mid" crease="faint" />
    <Solid paths={RAIL_Y_ART.stopFront} tone="mid" crease="faint" />
    {RAIL_Y_ART.bushings.map((paths, i) => (
      <Solid key={i} paths={paths} tone="mid" crease="faint" />
    ))}
  </g>
);

const CARRIAGE_STATIC = (
  <g key="carriage-static">
    <Solid paths={CARRIAGE_ART.body} tone="mid" crease="faint" />
    <Line d={CARRIAGE_ART.seat} tone="lo" />
    {CARRIAGE_ART.bushings.map((paths, i) => (
      <Solid key={i} paths={paths} tone="lo" crease="faint" />
    ))}
    <Solid paths={CARRIAGE_ART.knob} tone="mid" crease="faint" />
    <Line d={CARRIAGE_ART.knurl} tone="lo" />
    <Dots points={CARRIAGE_ART.rivets} size={0.45} tone="mid" />
  </g>
);

const HEAD_STATIC = (
  <g key="head-static">
    <Solid paths={HEAD_ART.arm} tone="mid" crease="faint" />
    <Solid paths={HEAD_ART.collar} tone="lo" crease="faint" />
    <Solid paths={HEAD_ART.housing} tone="mid" crease="faint" />
    <Line d={HEAD_ART.knurl} tone="lo" />
    <Line d={HEAD_ART.seam} tone="faint" />
    <Solid paths={HEAD_ART.clamp} tone="hi" crease="faint" />
    <Solid paths={HEAD_ART.holder} tone="lo" crease="none" />
  </g>
);

const RAIL_X_STOPS_FRONT = (
  <g key="rail-x-stops-front">
    <Solid paths={RAIL_X_ART.stopL} tone="mid" crease="faint" />
    <Solid paths={RAIL_X_ART.stopR} tone="mid" crease="faint" />
  </g>
);

const POWER_BTN = (
  <g key="power-btn">
    <Solid paths={TABLE_ART.powerBody} tone="lo" crease="faint" />
    <Line d={TABLE_ART.powerRing} tone="mid" />
    <Dots points={TABLE_ART.powerDot} size={2} tone="hi" />
  </g>
);

// ─── Aria label ───────────────────────────────────────────────────────────────
const ARIA_LABEL =
  "A flatbed plotter: the pen head slides along a horizontal rail above a drawing table. " +
  "Drag left or right to move the carriage, Space to lower or raise the pen, " +
  "arrow keys to nudge, Home and End for the extremes.";

// ─── Server entry point ───────────────────────────────────────────────────────
export function PlotterArt() {
  return (
    <PlotterLive
      label={ARIA_LABEL}
      table={TABLE}
      railXBack={RAIL_X_BACK}
      paper={PAPER}
      railY={RAIL_Y}
      carriageStatic={CARRIAGE_STATIC}
      headStatic={HEAD_STATIC}
      railXFront={RAIL_X_STOPS_FRONT}
      powerBtn={POWER_BTN}
      restFrame={REST_FRAME}
    />
  );
}
