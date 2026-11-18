"use client";
/**
 * ToolFigure — renders one isometric tool and orbits it around the vertical
 * axis (left → back → right → front) by rebuilding geometry each rAF at a
 * slowly decreasing azimuth.
 *
 * Hydration strategy: the initial state is `null` (renders a blank
 * placeholder). After mount, `useEffect` sets the first azimuth and starts
 * the loop. This guarantees the server HTML and the client's first render
 * match (both produce just the wrapper div with no SVG children), avoiding
 * the hydration mismatch caused by azimuth-dependent path strings.
 */
import "./tools.css";
import * as React from "react";
import { useInView, asksForStillness } from "@/components/iso/react/live";
import { WIDTH, HEIGHT, projectionAt } from "./view";
import { IsoClipboard } from "./clipboard";
import { IsoPencil } from "./pencil";
import { IsoWrench } from "./wrench";
import { IsoLevel } from "./level";
import { IsoTape } from "./tape";
import { IsoHammer } from "./hammer";
import type { Projection } from "@/components/iso/iso-kit";

export type ToolFigureName =
  | "clipboard"
  | "pencil"
  | "wrench"
  | "level"
  | "tape"
  | "hammer";

const FIGURES: Record<
  ToolFigureName,
  (props: { p: Projection }) => React.ReactElement
> = {
  clipboard: IsoClipboard,
  pencil:    IsoPencil,
  wrench:    IsoWrench,
  level:     IsoLevel,
  tape:      IsoTape,
  hammer:    IsoHammer,
};

const LABELS: Record<ToolFigureName, string> = {
  clipboard: "A clip board holding a sheet of paper — template sheets.",
  pencil:    "A red pencil — the assistant's redline edits.",
  wrench:    "An open-end wrench — workspace knowledge.",
  level:     "A spirit level with a bubble — the single-writer lock.",
  tape:      "A tape measure — import and export.",
  hammer:    "A claw hammer — bring your own key.",
};

/** Degrees per second of azimuth orbit (left → back → right → front). */
const DEG_PER_SEC = 18; // ~20 s per full revolution

export function ToolFigure({ name }: { name: ToolFigureName }) {
  const Figure = FIGURES[name];
  const wrapRef = React.useRef<HTMLDivElement>(null);
  const inView  = useInView(wrapRef);

  // null = not yet mounted (server + first client render both see null →
  // no hydration mismatch). After mount, we set the real starting azimuth.
  const [azimuth, setAzimuth] = React.useState<number | null>(null);
  const azRef    = React.useRef(45);
  const lastRef  = React.useRef(0);
  const frameRef = React.useRef(0);

  // Initialise after mount so both server and first-client render agree.
  React.useEffect(() => {
    setAzimuth(azRef.current);
  }, []);

  // Track mounted state so the loop effect has a stable boolean dependency.
  const mounted = azimuth !== null;

  // Animation loop — only runs while mounted and in view.
  React.useEffect(() => {
    if (!mounted || !inView || asksForStillness()) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = 0;
      return;
    }
    lastRef.current = 0;
    const tick = (now: number) => {
      const dt = lastRef.current
        ? Math.min((now - lastRef.current) / 1000, 1 / 30)
        : 1 / 60;
      lastRef.current = now;
      // Decrease azimuth → near face sweeps left → back → right → front
      azRef.current = ((azRef.current - DEG_PER_SEC * dt) % 360 + 360) % 360;
      setAzimuth(azRef.current);
      frameRef.current = requestAnimationFrame(tick);
    };
    frameRef.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = 0;
    };
  }, [mounted, inView]);

  return (
    <div
      ref={wrapRef}
      className="iso tool-fig tool-enter"
      aria-hidden
      // Keep a stable min-height so the card doesn't collapse before mount.
      style={{ minHeight: "80px" }}
    >
      {azimuth !== null && (
        <svg
          className="iso-svg"
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          role="img"
          aria-label={LABELS[name]}
          focusable="false"
        >
          <Figure p={projectionAt(azimuth)} />
        </svg>
      )}
    </div>
  );
}
